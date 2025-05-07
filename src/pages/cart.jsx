import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cart.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  
  // New state for address details
  const [addressDetails, setAddressDetails] = useState({
    delivery_address: "",
    city: "",
    zipcode: "",
    country: "",
    latitude: null,
    longitude: null
  });
  
  // New state to control address form visibility
  const [showAddressForm, setShowAddressForm] = useState(false);

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

  const updateQty = async (id, change) => {
    const item = items.find(i => i.id === id);
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:5000/cart/${id}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      setSelected(prev => {
        const c = { ...prev };
        delete c[id];
        return c;
      });
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      setSelected({});
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          
          // Store coordinates in state
          setAddressDetails(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            setLocation(res.data.address.city || res.data.address.town || "Your Area");
            
            // Pre-fill address fields
            const address = res.data.address;
            setAddressDetails(prev => ({
              ...prev,
              delivery_address: address.road ? `${address.house_number || ''} ${address.road}`.trim() : '',
              city: address.city || address.town || '',
              zipcode: address.postcode || '',
              country: address.country || ''
            }));
          } catch {
            fallbackToIP();
          }
        },
        () => fallbackToIP()
      );
    } else {
      fallbackToIP();
    }
  };
  
  const fallbackToIP = async () => {
    try {
      const res = await axios.get("https://ipapi.co/json");
      setLocation(`${res.data.city}, ${res.data.region}`);
      
      // Pre-fill city and country
      setAddressDetails(prev => ({
        ...prev,
        city: res.data.city || '',
        country: res.data.country_name || ''
      }));
    } catch {
      setLocation("Unable to fetch location");
    }
  };

  useEffect(() => {
    fetchCart();
    fetchLocation();
  }, []);

  const toggleSelect = (cartItemId) => {
    setSelected(prev => ({
      ...prev,
      [cartItemId]: !prev[cartItemId],
    }));
  };
  
  // Handle address form input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckout = async () => {
    // Validate address details first
    if (!addressDetails.delivery_address || !addressDetails.city) {
      alert("Please provide your complete delivery address and city");
      setShowAddressForm(true); // Force show the form
      return;
    }
    
    console.log("Sending address details:", addressDetails); // Debug log
    setIsLoading(true);
    
    
    try {
      const selectedItems = items
        .filter(item => selected[item.id])
        .map(item => ({
          id: item.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price
        }));
  
      if (selectedItems.length === 0) {
        alert("Select at least one item to checkout.");
        setIsLoading(false);
        return;
      }
  
      const res = await axios.post("http://localhost:5000/checkout", {
        items: selectedItems,
        addressDetails // Send address details with the order
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert(`Order placed! Order ID: ${res.data.orderId}`);
      fetchCart();
      setSelected({});
      setShowAddressForm(false); // Hide the form after successful checkout
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Only for selected items
  const selectedItems = items.filter(it => selected[it.id]);
  const subtotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const delivery = selectedItems.length ? 100 : 0;
  const total = subtotal + tax + delivery;

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Picks</h2>
          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
        </div>
        <div className='h3'><h3>Let's seal the deal!</h3></div>
        <p className="location-text">Deliver to: {location} 
          <button 
            className="change-address-btn" 
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? 'Hide Address Form' : 'Update Address'}
          </button>
        </p>

        {/* Address Form */}
        {showAddressForm && (
          <div className="address-form">
            <h4>Delivery Address</h4>
            <div className="form-group">
              <label>Street Address*</label>
              <input 
                type="text" 
                name="delivery_address" 
                value={addressDetails.delivery_address} 
                onChange={handleAddressChange}
                placeholder="House/Apt No., Street Name" 
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City*</label>
                <input 
                  type="text" 
                  name="city" 
                  value={addressDetails.city} 
                  onChange={handleAddressChange}
                  placeholder="City" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Zip/Postal Code</label>
                <input 
                  type="text" 
                  name="zipcode" 
                  value={addressDetails.zipcode} 
                  onChange={handleAddressChange}
                  placeholder="Zip/Postal Code"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input 
                type="text" 
                name="country" 
                value={addressDetails.country} 
                onChange={handleAddressChange}
                placeholder="Country"
              />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <input 
                  type="checkbox" 
                  checked={!!selected[item.id]} 
                  onChange={() => toggleSelect(item.id)}
                />
                <img src={item.image_url} alt={item.name} />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <div className="quantity-controls">
                    <button onClick={() => updateQty(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="item-meta">
                  <p>Rs. {item.price * item.quantity}</p>
                  <button className="delete-btn" onClick={() => deleteItem(item.id)}>×</button>
                </div>
              </div>
            ))}

            <div className="summary">
              <div className="row"><span>Subtotal</span><span>Rs. {subtotal.toFixed(0)}</span></div>
              <div className="row"><span>Tax (13%)</span><span>Rs. {tax.toFixed(0)}</span></div>
              <div className="row"><span>Delivery</span><span>Rs. {delivery}</span></div>
              <div className="row total"><strong>Total</strong><strong>Rs. {total.toFixed(0)}</strong></div>
              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
                disabled={!selectedItems.length || isLoading || (!addressDetails.delivery_address && !addressDetails.city)}
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