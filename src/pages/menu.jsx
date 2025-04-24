import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:5000/menu'),
          axios.get('http://localhost:5000/categories')
        ]);
        setMenuItems(menuRes.data);
        setCategories(categoryRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

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

      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item. Please try again.");
    }

    closeModal();
  };

  return (
    <div className="menu-container">
      {loading ? (
        <p>Loading menu items...</p>
      ) : (
        categories.map(category => {
          const itemsInCategory = menuItems.filter(
            item => item.category === category.category
          );

          return (
            <div className="menu-category" key={category.id}>
             <img
  src={`http://localhost:5000${category.category_image.startsWith('/') ? '' : '/'}${category.category_image}`}
  alt={category.category}
  className="category-banner"
/>

              <div className="menu-items">
                {itemsInCategory.map(item => (
                  <div className="menu-item" key={item.id}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="menu-image"
                    />
                    <h3 className="menu-title">{item.name}</h3>
                    <p className="menu-price">Rs. {item.price}</p>
                    <button
                      className="add-cart-btn"
                      onClick={() => openModal(item)}
                    >
                      Add To Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Modal logic here (unchanged) */}
    </div>
  );
};

export default Menu;
