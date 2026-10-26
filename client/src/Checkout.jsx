import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { api } from "./api";

function Checkout({ cart, onOrdered }) {
  const [form, setForm] = useState({ address: "", city: "", pincode: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
    if (form.address.trim().length < 5) return toast.error("Please enter your street address");
    if (form.city.trim().length < 2) return toast.error("Please enter your city");
    if (!/^\d{6}$/.test(form.pincode)) return toast.error("Enter a valid 6-digit pincode");
    if (!/^\d{10}$/.test(form.phone)) return toast.error("Enter a valid 10-digit phone number");

    setLoading(true);
    try {
      const order = await api("/orders", "POST", {
        items: cart.map((i) => ({ productId: i._id, qty: i.qty })),
        address: `${form.address}, ${form.city} - ${form.pincode}`,
        phone: form.phone,
      });
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      onOrdered(order);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  if (cart.length === 0)
    return (
      <div className="center-card">
        <div className="big-emoji">🛒</div>
        <h2>Nothing to checkout</h2>
        <Link to="/shop" className="add-btn">Go to Shop</Link>
      </div>
    );

  return (
    <div>
      <h2 className="page-title">Checkout</h2>
      <div className="cart-layout">
        <div className="form-card">
          <h3>Delivery Details</h3>
          <div className="form-grid two">
            <input className="wide" name="address" placeholder="Street address" value={form.address} onChange={change} />
            <input name="city" placeholder="City" value={form.city} onChange={change} />
            <input
              name="pincode"
              placeholder="Pincode (6 digits)"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })}
            />
            <input
              className="wide"
              name="phone"
              placeholder="Phone number (10 digits)"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div className="pay-box">💵 Payment method: <b>Cash on Delivery</b></div>
        </div>

        <div className="panel summary">
          <h3>Your Order</h3>
          {cart.map((i) => (
            <div className="sum-row" key={i._id}>
              <span>{i.emoji} {i.name} × {i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="sum-row"><span>Delivery</span><span className="in-stock">FREE</span></div>
          <div className="sum-row total"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
          <button className="add-btn full" onClick={placeOrder} disabled={loading}>
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;