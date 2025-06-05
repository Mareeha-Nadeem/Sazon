// App.js
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/signup";
import Menu from "./pages/menu";
import Cart from "./pages/cart";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Explore from "./pages/Explore";
import './App.css';

function Home() {
  const overlayRef = useRef(null);
  const [userName, setUserName] = useState("Guest");
  const [craving, setCraving] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const { name } = JSON.parse(stored);
        setUserName(name);
      } catch {}
    }
    setTimeout(() => {
      applyThemeBasedOnBackground(".video-overlay");
    }, 500);
  }, []);

  return (
    <div className="home-container">
      <div className="home-page">
        <video autoPlay loop={false} muted className="background-video">
          <source src="/bg.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay" ref={overlayRef}></div>

        <div className="home-content">
          <div className="content-wrapper">
            <div className="logo-container">
              <img src="/sazon logo.png" alt="Logo 1" className="logo primary-logo" />
              <img src="/sazon log white.png" alt="Logo 2" className="logo secondary-logo" />
            </div>

            <div className="text-container">
              <p className="tagline"><b>Welcome, {userName}!</b></p>
              <h1 className="welcome-text">
                Where every craving meets a dish full of flavor and heart.
              </h1>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Enter your Craving"
                className="craving-input"
                value={craving}
                onChange={e => setCraving(e.target.value)}
              />
              <button
                className="find-food-btn"
                onClick={() => {
                  const q = craving.trim();
                  navigate(q ? `/menu?search=${encodeURIComponent(q)}` : '/menu');
                }}
              >
                Find food
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout component that includes the footer for appropriate pages
function PageLayout({ children }) {
  const location = useLocation();
  const pathsWithoutFooter = ['/login', '/signup'];
  const showFooter = !pathsWithoutFooter.includes(location.pathname);

  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </PageLayout>
    </Router>
  );
}