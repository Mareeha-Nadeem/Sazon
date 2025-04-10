import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on page load
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token"); // in case token bhi store hai
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/menu" style={linkStyle}>Menu</Link>

      {!isLoggedIn ? (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/signup" style={linkStyle}>Signup</Link>
        </>
      ) : (
        <>
          <Link to="/cart" style={linkStyle}>Cart</Link>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </>
      )}
    </nav>
  );
}

const navbarStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  backgroundColor: "#f5f5f5",
  padding: "10px",
  borderBottom: "1px solid #ccc",
};

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "bold",
};

const buttonStyle = {
  backgroundColor: "#ff4d4d",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default Navbar;
