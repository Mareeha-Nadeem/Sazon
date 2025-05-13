import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cart.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSaved, setUseSaved] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [addressDetails, setAddressDetails] = useState({
    full_name: "",
    phone_number: "",
    street_address: "",
    city: "",
    zipcode: "",
    country: "",
    latitude: null,
    longitude: null,
    address_type: "Home",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Fetch cart & addresses & geoloc
  useEffect(() => {
    fetchCart();
    fetchAddresses();
    fetchLocation();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedAddresses(res.data);
      const def = res.data.find(a => a.is_default);
      if (def) setSelectedAddressId(def.address_id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setAddressDetails(d => ({ ...d, latitude, longitude }));
        try {
          const geo = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const a = geo.data.address;
          setLocation(a.city || a.town || "Your Area");
          setAddressDetails(d => ({
            ...d,
            street_address: a.house_number
              ? `${a.house_number} ${a.road}`
              : a.road || "",
            city: a.city || a.town || "",
            zipcode: a.postcode || "",
            country: a.country || ""
          }));
        } catch {
          // ignore
        }
      },
      () => {}
    );
  };

  const updateQty = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const q = item.quantity + delta;
    if (q < 1) return;
    await axios.put(
      `http://localhost:5000/cart/${id}`,
      { quantity: q },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCart();
  };

  const deleteItem = async id => {
    await axios.delete(`http://localhost:5000/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
    setSelected(s => { const c = { ...s }; delete c[id]; return c; });
  };

  const clearCart = async () => {
    await axios.delete("http://localhost:5000/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
    setSelected({});
  };

  const toggleSelect = id => {
    setSelected(s => ({ ...s, [id]: !s[id] }));
  };

  const handleAddressChange = e => {
    const { name, value } = e.target;
    setAddressDetails(d => ({ ...d, [name]: value }));
  };

  const handleSaveAddress = async () => {
    await axios.post(
      "http://localhost:5000/addresses",
      addressDetails,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchAddresses();
    setUseSaved(true);
  };

  const handleCheckout = async () => {
    const selectedItems = items
      .filter(i => selected[i.id])
      .map(i => ({
        id: i.id,
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        price: i.price
      }));
    if (!selectedItems.length) {
      return alert("Select at least one item.");
    }
    if (useSaved && !selectedAddressId) {
      return alert("Pick a saved address or add a new one.");
    }
    // If adding new, must have basics
    if (!useSaved && (!addressDetails.street_address || !addressDetails.city)) {
      setShowAddressForm(true);
      return alert("Fill in street address & city.");
    }
    setIsLoading(true);
    try {
      const payload = {
        items: selectedItems,
        addressId: useSaved ? selectedAddressId : null,
        addressDetails: useSaved ? null : addressDetails
      };
      const res = await axios.post(
        "http://localhost:5000/checkout",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Order placed! ID: ${res.data.orderId}`);
      fetchCart();
      setSelected({});
      setShowAddressForm(false);
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    }
    setIsLoading(false);
  };

  const selectedItems = items.filter(i => selected[i.id]);
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.13;
  const delivery = selectedItems.length ? 100 : 0;
  const total = subtotal + tax + delivery;

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Picks</h2>
          <button onClick={clearCart}>Clear Cart</button>
        </div>

        <p className="location-text">
          Deliver to: {location}
          <button onClick={() => setShowAddressForm(v => !v)}>
            {showAddressForm ? 'Hide Address Form' : 'Update Address'}
          </button>
        </p>

        {showAddressForm && (
          <div className="address-section">
            {/* Toggle */}
            <div className="address-toggle">
              <label>
                <input
                  type="radio"
                  checked={useSaved}
                  onChange={() => setUseSaved(true)}
                /> Use saved
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input
                  type="radio"
                  checked={!useSaved}
                  onChange={() => setUseSaved(false)}
                /> Add new
              </label>
            </div>

            {useSaved ? (
              <div className="saved-addresses">
                {savedAddresses.map(a => (
                  <div key={a.address_id} className="saved-address-item">
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === a.address_id}
                      onChange={() => setSelectedAddressId(a.address_id)}
                    />
                    <span>
                      {a.full_name}, {a.street_address}, {a.city}
                      {a.is_default && <strong> (Default)</strong>}
                    </span>
                    {!a.is_default && (
                      <button
                        className="set-default-btn"
                        onClick={async () => {
                          await axios.patch(
                            `http://localhost:5000/addresses/${a.address_id}/default`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          await fetchAddresses();
                          setSelectedAddressId(a.address_id);
                        }}
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="address-form">
                <h4>New Address</h4>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    name="full_name"
                    value={addressDetails.full_name}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="phone_number"
                    value={addressDetails.phone_number}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-group">
                  <label>Street*</label>
                  <input
                    name="street_address"
                    value={addressDetails.street_address}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City*</label>
                    <input
                      name="city"
                      value={addressDetails.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip</label>
                    <input
                      name="zipcode"
                      value={addressDetails.zipcode}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    name="country"
                    value={addressDetails.country}
                    onChange={handleAddressChange}
                  />
                </div>
                <button onClick={handleSaveAddress}>Save Address</button>
              </div>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {items.map(i => (
              <div key={i.id} className="cart-item">
                
                <input
                  type="checkbox"
                  checked={!!selected[i.id]}
                  onChange={() => toggleSelect(i.id)}
                />
                <img src={i.image_url} alt={i.name} />
                <div className="item-info">
                  <h3>{i.name}</h3>
                  <div className="quantity-controls">
                    <button onClick={() => updateQty(i.id, -1)}>-</button>
                    <span>{i.quantity}</span>
                    <button onClick={() => updateQty(i.id, 1)}>+</button>
                  </div>
                </div>
                <div className="item-meta">
                  <p>Rs. {i.price * i.quantity}</p>
                  <button onClick={() => deleteItem(i.id)}>×</button>
                </div>
              </div>
            ))}

            <div className="summary">
              <div><span>Subtotal</span><span>Rs. {subtotal.toFixed(0)}</span></div>
              <div><span>Tax (13%)</span><span>Rs. {tax.toFixed(0)}</span></div>
              <div><span>Delivery</span><span>Rs. {delivery}</span></div>
              <div className="total"><strong>Total</strong><strong>Rs. {total.toFixed(0)}</strong></div>
              <button
                onClick={handleCheckout}
                disabled={!selectedItems.length || isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
