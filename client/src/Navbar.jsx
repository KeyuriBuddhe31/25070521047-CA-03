import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaMoon, FaSun, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

function Navbar({ user, logout, dark, setDark, cartCount }) {
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) => (isActive ? "nav-btn active" : "nav-btn");

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🛍️ ShopEase</Link>

      <div className={open ? "nav-links open" : "nav-links"} onClick={() => setOpen(false)}>
        <NavLink to="/" end className={cls}>Home</NavLink>
        <NavLink to="/shop" className={cls}>Shop</NavLink>
        <NavLink to="/about" className={cls}>About</NavLink>
        <NavLink to="/contact" className={cls}>Contact</NavLink>
        {user && <NavLink to="/orders" className={cls}>My Orders</NavLink>}
        {user && <NavLink to="/profile" className={cls}>Profile</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin" className={cls}>Admin</NavLink>}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="hello">Hi, {user.name.split(" ")[0]}</span>
            <button className="icon-btn" onClick={logout} title="Logout"><FaSignOutAlt /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="add-btn small">Sign Up</Link>
          </>
        )}
        <button className="icon-btn" onClick={() => setDark(!dark)} title="Theme">
          {dark ? <FaSun /> : <FaMoon />}
        </button>
        <Link to="/cart" className="icon-btn" title="Cart">
          <FaShoppingCart />
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        <button className="icon-btn hamburger" onClick={() => setOpen(!open)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;