import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "./api";
import ProductCard from "./ProductCard";

const CATEGORIES = [
  { name: "Electronics", emoji: "🎧" },
  { name: "Fashion", emoji: "👟" },
  { name: "Home", emoji: "🏠" },
];

const FEATURES = [
  { icon: "🚚", title: "Free Delivery", text: "On every order" },
  { icon: "🔒", title: "Secure Shopping", text: "Your data is protected" },
  { icon: "↩️", title: "Easy Returns", text: "7 day return policy" },
  { icon: "🎧", title: "24/7 Support", text: "We are always here" },
];

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api("/products").then(setProducts).catch(() => {});
  }, []);

  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div>
      <div className="hero">
        <div>
          <h1>Mega Summer Sale</h1>
          <p>Discover amazing products at unbeatable prices. Free delivery on every order!</p>
          <div className="hero-btns">
            <Link to="/shop" className="add-btn white">Shop Now</Link>
            <Link to="/about" className="btn-outline white">Learn More</Link>
          </div>
        </div>
        <div className="hero-emoji">🛒</div>
      </div>

      <div className="info-grid">
        {FEATURES.map((f) => (
          <div className="info-card" key={f.title}>
            <div className="ic">{f.icon}</div>
            <h4>{f.title}</h4>
            <p className="muted">{f.text}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Shop by Category</h2>
      <div className="info-grid">
        {CATEGORIES.map((c) => (
          <Link to={`/shop?cat=${c.name}`} className="info-card cat-card" key={c.name}>
            <div className="ic">{c.emoji}</div>
            <h4>{c.name}</h4>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Top Rated Products</h2>
      <div className="grid">
        {featured.map((p, i) => (
          <ProductCard key={p._id} p={p} index={i} addToCart={addToCart} />
        ))}
      </div>

      <div className="cta">
        <h2>Ready to start shopping?</h2>
        <p>Create a free account and get your first order delivered at no cost.</p>
        <Link to="/register" className="add-btn white">Create Account</Link>
      </div>
    </div>
  );
}

export default Home;