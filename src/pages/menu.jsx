import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './menu.css'; // Tumhare custom CSS file ka link

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);  // State to store menu items
  const [loading, setLoading] = useState(true);     // Loading state

  // Fetch data from backend when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/menu')   // Tumhare backend server ki URL
      .then(response => {
        setMenuItems(response.data);  // Response se data set karo
        setLoading(false);             // Loading ko false kar do jab data mil jaye
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);  // Agar error aaye toh loading false kar do
      });
  }, []); // Empty dependency array, yeh sirf ek bar run hoga jab component mount ho

  return (
    <div className="menu-container">
      {loading ? (
        <p>Loading menu items...</p> // Agar loading hai toh yeh show hoga
      ) : (
        menuItems.length > 0 ? (  // Agar menu items hain
          menuItems.map(item => (
            <div className="menu-item" key={item.id}>
              <h3 className="menu-title">{item.name}</h3>
              <p className="menu-description">{item.description}</p>
              <p className="menu-price">Rs. {item.price}</p>
            </div>
          ))
        ) : (
          <p>No menu items available.</p> // Agar koi menu items na ho toh yeh show hoga
        )
      )}
    </div>
  );
};

export default Menu;
