import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

function Cart({ cart, user, changeQty, removeItem, clearCart }) {
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const goCheckout = () => {
    if (!user) {
      toast("Please login to continue", { icon: "🔐" });
      return navigate("/login", { state: { from: "/checkout" } });
    }
    navigate("/checkout");
  };

  if (cart.length === 0)
    return (
      <div className="center-card">
        <div className="big-emoji">🛒</div>
        <h2>Your cart is empty</h2>
        <p className="muted">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="add-btn">Start Shopping</Link>
      </div>
    );

  return (
    <div>
      <h2 className="page-title">Shopping Cart</h2>
      <div className="cart-layout">
        <div className="panel">
          {cart.map((i) => (
            <div className="cart-item" key={i._id}>
              <div className="ci-img">{i.image ? <img src={i.image} alt={i.name} /> : i.emoji}</div>
              <div className="ci-info">
                <Link to={`/product/${i._id}`} className="p-name-link"><strong>{i.name}</strong></Link>
                <span>₹{i.price.toLocaleString("en-IN")}</span>
                <div className="qty">
                  <button onClick={() => changeQty(i._id, -1)}><FaMinus /></button>
                  <b>{i.qty}</b>
                  <button onClick={() => changeQty(i._id, 1)}><FaPlus /></button>
                </div>
              </div>
              <b>₹{(i.price * i.qty).toLocaleString("en-IN")}</b>
              <button className="action delete" onClick={() => removeItem(i._id)}><FaTrash /></button>
            </div>
          ))}
          <button className="chip" style={{ marginTop: 14 }} onClick={clearCart}>Clear cart</button>
        </div>

        <div className="panel summary">
          <h3>Order Summary</h3>
          <div className="sum-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
          <div className="sum-row"><span>Delivery</span><span className="in-stock">FREE</span></div>
          <div className="sum-row total"><span>Total</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
          <button className="add-btn full" onClick={goCheckout}>Proceed to Checkout</button>
          <Link to="/shop" className="btn-outline" style={{ textAlign: "center" }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;