import { Link } from "react-router-dom";

function Navbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // Check if the user is logged in

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/menu" style={linkStyle}>Menu</Link>

      {/* Show Login or Logout depending on the login state */}
      {!isLoggedIn ? (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/signup" style={linkStyle}>Signup</Link>
        </>
      ) : (
        <>
          <Link to="/cart" style={linkStyle}>Cart</Link>
          <Link to="/orders" style={linkStyle}>Orders</Link>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
        </>
      )}
    </nav>
  );

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("isLoggedIn"); // Remove login status from localStorage
    window.location.href = "/login"; // Redirect to login page after logout
  }
}

// Styling for navbar and links (optional)
const navbarStyle = {
  display: "flex",
  justifyContent: "space-around",
  padding: "10px",
  backgroundColor: "#333",
};

const linkStyle = {
  textDecoration: "none",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
};

const buttonStyle = {
  backgroundColor: "#e74c3c",
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

export default Navbar;
