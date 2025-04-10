import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Menu from "./pages/menu";
import Cart from "./pages/cart";
import Navbar from "./components/Navbar"; // Navbar import

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar har page pe dikhega */}
      <Routes>
        <Route path="/" element={<h2>Welcome to Sazon!</h2>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
