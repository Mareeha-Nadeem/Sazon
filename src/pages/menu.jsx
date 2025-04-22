import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './menu.css';


const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:5000/menu')
      .then(response => {
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const groupedItems = menuItems.reduce((groups, item) => {
    const { category } = item;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const confirmAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to your cart.");
      closeModal();
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/cart',
        {
          menu_item_id: selectedItem.id,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(`✅ Added to cart: ${selectedItem.name} x ${quantity}`);
      alert("Item added to cart!");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Failed to add item. Please try again.");
    }

    closeModal();
  };

  return (
    <div className="menu-container">
      {loading ? (
        <p>Loading menu items...</p>
      ) : (
        Object.keys(groupedItems).map(category => (
          <div className="menu-category" key={category}>
            <h2 className="category-title">{category}</h2>
            <div className="menu-items">
              {groupedItems[category].map(item => (
                <div className="menu-item" key={item.id}>
                  <img src={item.image_url} alt={item.name} className="menu-image" />
                  <h3 className="menu-title">{item.name}</h3>
                  <p className="menu-price">Rs. {item.price}</p>
                  <button className="add-cart-btn" onClick={() => openModal(item)}>
                    Add To Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>×</button>
            <img src={selectedItem.image_url} alt={selectedItem.name} className="modal-image" />
            <h2>{selectedItem.name}</h2>
            <h3>Rs. {selectedItem.price}</h3>
            <p>{selectedItem.description}</p>

            <div className="qty-controls">
              <button onClick={decreaseQty}>−</button>
              <span>{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>

            <button className="modal-add-btn" onClick={confirmAddToCart}>
              Add {quantity} to cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
