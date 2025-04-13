import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Menu from "./pages/menu";
import Cart from "./pages/cart";
import Navbar from "./components/Navbar"; // Navbar import
import './App.css'; // Import the CSS file for styling

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar har page pe dikhega */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-page">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (Dark layer over the video) */}
      <div className="video-overlay"></div>

      {/* Content */}
      <div className="content">
        <h1>Welcome to Sazon!</h1>
        <p>Delicious food delivered to your doorstep</p>
      </div>
    </div>
  );
}

export default App;
