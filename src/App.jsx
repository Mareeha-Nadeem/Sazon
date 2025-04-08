import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu from "./pages/menu";
import Layout from "./components/layout"; // Correct import for Layout
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout will be used for authenticated pages */}
        <Route element={<Layout />}>
          <Route path="/" index element={<h2>Welcome to Sazon!</h2>} />  {/* Home Page */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* Pages that don't require Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
