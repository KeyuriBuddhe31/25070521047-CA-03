import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaStar, FaCartPlus } from "react-icons/fa";
import { api } from "./api";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/products/${id}`)
      .then(setP)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error)
    return (
      <div className="center-card">
        <div className="big-emoji">😕</div>
        <h2>{error}</h2>
        <Link to="/shop" className="add-btn">Back to Shop</Link>
      </div>
    );
  if (!p) return <p className="empty">Loading...</p>;

  const buyNow = () => {
    addToCart(p, qty);
    navigate("/cart");
  };

  return (
    <div>
      <Link to="/shop" className="back-link">← Back to Shop</Link>
      <div className="detail">
        <div className="detail-img">
          {p.image ? <img src={p.image} alt={p.name} /> : <span>{p.emoji}</span>}
        </div>

        <div className="detail-info">
          <span className="p-cat">{p.category}</span>
          <h1>{p.name}</h1>
          <div className="stars"><FaStar /> {p.rating} rating</div>
          <div className="detail-price">₹{p.price.toLocaleString("en-IN")}</div>
          <p className="muted">{p.description || "No description available."}</p>

          {p.stock > 0 ? (
            <>
              <p className="in-stock">✔ In stock ({p.stock} available)</p>
              <div className="qty-row">
                <span>Quantity:</span>
                <div className="qty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <b>{qty}</b>
                  <button onClick={() => setQty(Math.min(p.stock, qty + 1))}>+</button>
                </div>
              </div>
              <div className="btn-row">
                <button className="add-btn" onClick={() => addToCart(p, qty)}>
                  <FaCartPlus /> Add to Cart
                </button>
                <button className="btn-outline" onClick={buyNow}>Buy Now</button>
              </div>
            </>
          ) : (
            <p className="out-stock">✖ Out of stock</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;