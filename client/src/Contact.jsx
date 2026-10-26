import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const send = async () => {
    if (!form.name || !form.email || !form.message) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await api("/contact", "POST", form);
      toast.success("Message sent! We will contact you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="page-title">Contact Us</h2>
      <div className="info-grid">
        <div className="info-card"><div className="ic">📍</div><h4>Address</h4><p className="muted">Nagpur, Maharashtra, India</p></div>
        <div className="info-card"><div className="ic">📞</div><h4>Phone</h4><p className="muted">+91 98765 43210</p></div>
        <div className="info-card"><div className="ic">✉️</div><h4>Email</h4><p className="muted">support@shopease.com</p></div>
      </div>

      <div className="form-card" style={{ marginTop: 22 }}>
        <h3>Send us a message</h3>
        <div className="form-grid two">
          <input name="name" placeholder="Your name" value={form.name} onChange={change} />
          <input name="email" type="email" placeholder="Your email" value={form.email} onChange={change} />
          <textarea className="wide" name="message" rows={5} placeholder="Your message" value={form.message} onChange={change} />
        </div>
        <div className="form-btns">
          <button className="add-btn" onClick={send} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;