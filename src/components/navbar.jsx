import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaHome, FaUtensils, FaCompass } from "react-icons/fa";
import "./navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");
    setIsLoggedIn(loggedIn);
  
    if (token) {
      fetchCartCount(token);
    }
  }, []);

  const fetchCartCount = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCartCount(data.length);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} aria-label="Home" tabIndex={0} end>
          <FaHome className="nav-icon" /> <span>Home</span>
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} aria-label="Menu" tabIndex={0}>
          <FaUtensils className="nav-icon" /> <span>Menu</span>
        </NavLink>
        {isLoggedIn && (
          <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} aria-label="Explore" tabIndex={0}>
            <FaCompass className="nav-icon" /> <span>Explore</span>
          </NavLink>
        )}
      </div>

      <div className="nav-auth">
        {isLoggedIn && (
          <NavLink to="/cart" className="auth-btn cart-icon-link" aria-label="Cart" tabIndex={0}>
            <FaShoppingCart className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </NavLink>
        )}
        {isLoggedIn ? (
          <button className="auth-btn" onClick={handleLogout} aria-label="Logout" tabIndex={0}>Logout</button>
        ) : (
          <>
            <NavLink to="/login" className="auth-btn" aria-label="Login" tabIndex={0}>Login</NavLink>
            <NavLink to="/signup" className="auth-btn" aria-label="Signup" tabIndex={0}>Signup</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
