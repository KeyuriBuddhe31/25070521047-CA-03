import { Link, Navigate, useLocation } from "react-router-dom";

function OrderSuccess() {
  const state = useLocation().state;
  if (!state?.orderId) return <Navigate to="/" replace />;

  return (
    <div className="center-card">
      <div className="big-emoji">🎉</div>
      <h2>Order placed successfully!</h2>
      <p className="muted">Your order number is</p>
      <h1>#{state.orderId.slice(-6).toUpperCase()}</h1>
      <p className="muted">We will deliver it soon. You can track it in My Orders.</p>
      <div className="btn-row" style={{ justifyContent: "center", marginTop: 16 }}>
        <Link to="/orders" className="add-btn">Track Order</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderSuccess;