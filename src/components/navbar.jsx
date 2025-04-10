import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={navbarStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/menu" style={linkStyle}>Menu</Link>
      <Link to="/cart" style={linkStyle}>Cart</Link>
      <Link to="/login" style={linkStyle}>Login</Link>
      <Link to="/signup" style={linkStyle}>Signup</Link>
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

export default Navbar;
