// Layout.jsx
import Navbar from "./navbar"; // Import Navbar component

function Layout({ children }) {
  return (
    <div className="App">
      <Navbar />  {/* Navbar will be displayed on every page */}
      <h1>Sazon</h1>
      <main>{children}</main>  {/* Dynamic content passed from other components */}
    </div>
  );
}

export default Layout;
