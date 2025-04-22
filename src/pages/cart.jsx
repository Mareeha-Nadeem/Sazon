import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './cart.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState("");
  const token = localStorage.getItem("token");

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
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            setLocation(res.data.address.city || res.data.address.town || "Your Area");
          } catch {
            fallbackToIP(); // use fallback if openstreetmap fails
          }
        },
        () => fallbackToIP() // if geolocation denied
      );
    } else {
      fallbackToIP(); // browser doesn't support geolocation
    }
  };
  
  const fallbackToIP = async () => {
    try {
      const res = await axios.get("https://ipapi.co/json");
      setLocation(`${res.data.city}, ${res.data.region}`);
    } catch {
      setLocation("Unable to fetch location");
    }
  };
  

  useEffect(() => {
    fetchCart();
    fetchLocation();
  }, []);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const delivery = 100;
  const total = subtotal + tax + delivery;

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
        </div>

        <p className="location-text">Deliver to: {location}</p>

        {items.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            {items.map(item => (
              <div className="cart-item" key={item.id}>
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
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
