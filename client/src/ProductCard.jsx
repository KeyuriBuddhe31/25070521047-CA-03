import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaCartPlus } from "react-icons/fa";

function ProductCard({ p, addToCart, index = 0 }) {
  return (
    <motion.div
      className="product"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/product/${p._id}`} className="p-img">
        {p.image ? <img src={p.image} alt={p.name} /> : <span>{p.emoji}</span>}
        {p.stock > 0 && p.stock <= 5 && <span className="low-tag">Only {p.stock} left!</span>}
      </Link>
      <div className="p-body">
        <span className="p-cat">{p.category}</span>
        <Link to={`/product/${p._id}`} className="p-name-link">
          <h3 className="p-name">{p.name}</h3>
        </Link>
        <p className="p-desc">{p.description}</p>
        <div className="stars"><FaStar /> {p.rating}</div>
        <div className="p-foot">
          <span className="price">₹{p.price.toLocaleString("en-IN")}</span>
          <button className="add-btn small" disabled={p.stock === 0} onClick={() => addToCart(p)}>
            {p.stock === 0 ? "Sold out" : <><FaCartPlus /> Add</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;