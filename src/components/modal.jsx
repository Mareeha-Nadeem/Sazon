import React from "react";
// import "./modal.css";

const Modal = ({ item, quantity, setQuantity, onClose, onConfirm }) => {
  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={item.image_url} alt={item.name} className="modal-image" />
        <h2>{item.name}</h2>
        <h3>Rs. {item.price}</h3>
        <p>{item.description}</p>

        <div className="qty-controls">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        <button className="modal-add-btn" onClick={onConfirm}>
          Add {quantity} to cart
        </button>
      </div>
    </div>
  );
};

export default Modal;
