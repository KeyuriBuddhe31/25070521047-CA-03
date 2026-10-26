import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { api } from "./api";

const STEPS = ["Pending", "Shipped", "Delivered"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/orders/mine")
      .then(setOrders)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="page-title">My Orders</h2>
      {loading && <p className="empty">Loading...</p>}
      {!loading && orders.length === 0 && (
        <div className="center-card">
          <div className="big-emoji">📦</div>
          <h2>No orders yet</h2>
          <Link to="/shop" className="add-btn">Start Shopping</Link>
        </div>
      )}

      {orders.map((o) => {
        const step = STEPS.indexOf(o.status);
        return (
          <div className="order-card" key={o._id}>
            <div className="order-top">
              <div>
                <strong>Order #{o._id.slice(-6).toUpperCase()}</strong>
                <span className="muted"> · {new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
            </div>

            <div className="tracker">
              {STEPS.map((s, i) => (
                <div key={s} className={i <= step ? "t-step done" : "t-step"}>
                  <div className="t-dot">{i <= step && <FaCheckCircle />}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="order-items">
              {o.items.map((it, i) => (
                <div key={i} className="order-item">
                  <span>{it.emoji} {it.name} × {it.qty}</span>
                  <span>₹{(it.price * it.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="order-bottom">
              <span className="muted">Deliver to: {o.address}</span>
              <b>Total: ₹{o.total.toLocaleString("en-IN")}</b>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;