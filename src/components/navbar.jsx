import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // ✅ Import cart icon
import "./navbar.css";


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");
    setIsLoggedIn(loggedIn);
  
    if (token) {
      fetchCartCount(token);
    }
  
    // ✅ Apply theme when Navbar mounts
     // or "body" or any element with visible bg
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

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="left">
        <button className="hamburger" onClick={toggleMenu}>≡</button>
        {menuOpen && (
          <div className="side-menu">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
          </div>
        )}
      </div>

      <div className="right">
        {isLoggedIn ? (
          <>
            <Link to="/cart" className="auth-btn cart-icon-link" title="Cart">
              <FaShoppingCart size={24} className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
            <button className="auth-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn">Login</Link>
            <Link to="/signup" className="auth-btn">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
