import Navbar from "./navbar";
import { Outlet } from "react-router-dom"; // 👈 ye import zaroori hai!

function Layout() {
  return (
    <div className="App">
      <Navbar />
      <h1>Sazon</h1>
      <main>
        <Outlet /> {/* 👈 children ki jagah ye use karo in Routes */}
      </main>
    </div>
  );
}
export default Layout;
