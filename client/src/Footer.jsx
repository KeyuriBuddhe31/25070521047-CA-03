import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="brand">🛍️ ShopEase</div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p>© 2026 ShopEase. Built with MongoDB, Express, React and Node.js.</p>
    </footer>
  );
}

export default Footer;