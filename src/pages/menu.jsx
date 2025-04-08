import { useEffect, useState } from "react";
import axios from "axios";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get("http://localhost:5000/menu");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const addToCart = (item) => {
    if (!localStorage.getItem("token")) {
      alert("Please login to add items to the cart.");
      return;
    }
    
    setCart([...cart, item]);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div>
      <h2>Menu</h2>
      <div>
        {menuItems.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.price} PKR</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
