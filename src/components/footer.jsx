// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import './footer.css';
const Footer = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("user") !== null;
  const currentYear = new Date().getFullYear();
  
  // Get user data if logged in
  let userData = null;
  if (isLoggedIn) {
    try {
      userData = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <img 
            src="/sazon logo.png" 
            alt="Sazon Logo" 
            className="footer-logo" 
          />
          <img 
            src="/sazon log white.png" 
            alt="Sazon Logo" 
            className="footer-logo2" 
          />
          <p>
            Where every craving meets a dish full of flavor and heart. 
            Delivering delicious experiences right to your doorstep.
          </p>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            
            {isLoggedIn ? (
              // Show profile or account related links if logged in
              <li><Link to="/cart">Cart</Link></li>
            ) : (
              // Show login/signup if not logged in
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <FaEnvelope /> support@sazon.com
          </div>
          <div className="contact-item">
            <FaPhone /> +1 (555) 123-4567
          </div>
        </div>

        <div className="footer-section social">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
          
          {isLoggedIn && (
            <div className="user-section">
              <h3>Account</h3>
              <p>
                <FaUser /> {userData?.name || "User"}
              </p>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Sazon. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;