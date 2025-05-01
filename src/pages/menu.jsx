import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './menu.css';
import Modal from '../components/modal';
import { useLocation } from 'react-router-dom';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { search } = useLocation();
  const rawQuery = new URLSearchParams(search).get('search')?.trim().toLowerCase() || '';
  const queryWords = rawQuery.split(/\s+/).filter(Boolean);

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
        { menu_item_id: selectedItem.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item. Please try again.");
    }
    closeModal();
  };

  if (loading) {
    return <p>Loading menu items...</p>;
  }

  // Helper: does item name match any query word?
  const matchesQuery = (name) => {
    if (queryWords.length === 0) return true;
    const lowerName = name.toLowerCase();
    return queryWords.some(word => lowerName.includes(word));
  };

  // Build list of categories to display:
  const visibleCategories = categories.filter(category => {
    const matches = menuItems.filter(item =>
      item.category === category.category && matchesQuery(item.name)
    );
    return matches.length > 0;
  });

  // If a search was performed and no results at all, show a centered message below the navbar
  if (rawQuery && visibleCategories.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 60px)',
        marginTop: '60px',
        backgroundColor: 'white'
      }}>
        <p style={{
          color: 'black',
          textAlign: 'center'
        }}>
          No “{rawQuery}” items found.
        </p>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {visibleCategories.map(category => {
        const itemsInCategory = menuItems
          .filter(item => item.category === category.category)
          .filter(item => matchesQuery(item.name));

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
        );
      })}

      {selectedItem && (
        <Modal
          item={selectedItem}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={closeModal}
          onConfirm={confirmAddToCart}
        />
      )}
    </div>
  );
};

export default Menu;
