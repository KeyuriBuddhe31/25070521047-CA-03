import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEdit, FaTrash, FaRupeeSign, FaBoxes, FaClipboardList, FaExclamationTriangle,
} from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
} from "recharts";
import { api } from "./api";

const EMPTY = { name: "", description: "", price: "", category: "", stock: "", emoji: "🛍️", image: "" };
const STATUS_COLORS = { Pending: "#f6ad55", Shipped: "#667eea", Delivered: "#38a169" };

function Admin({ tab }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      setProducts(await api("/products"));
      setOrders(await api("/orders"));
      setMessages(await api("/messages"));
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveProduct = async () => {
    if (!form.name.trim() || form.price === "") return toast.error("Name and price are required");
    const body = { ...form, price: Number(form.price), stock: Number(form.stock || 0) };
    try {
      if (editId) await api(`/products/${editId}`, "PUT", body);
      else await api("/products", "POST", body);
      toast.success(editId ? "Product updated" : "Product added");
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const startEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, description: p.description, price: p.price, category: p.category,
      stock: p.stock, emoji: p.emoji, image: p.image,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api(`/products/${id}`, "DELETE");
    toast("Product deleted", { icon: "🗑️" });
    load();
  };

  const updateStatus = async (id, status) => {
    try {
      await api(`/orders/${id}`, "PUT", { status });
      toast.success("Status updated to " + status);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  // ----- Dashboard numbers -----
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5).length;

  const statusData = ["Pending", "Shipped", "Delivered"]
    .map((s) => ({ name: s, value: orders.filter((o) => o.status === s).length }))
    .filter((d) => d.value > 0);

  const sold = {};
  orders.forEach((o) =>
    o.items.forEach((i) => {
      sold[i.name] = (sold[i.name] || 0) + i.qty;
    })
  );
  const topData = Object.entries(sold)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div>
      <h2 className="page-title">Admin Panel</h2>

      <div className="admin-tabs">
        {[["", "Dashboard"], ["/products", "Products"], ["/orders", "Orders"], ["/messages", "Messages"]].map(
          ([path, label]) => (
            <Link
              key={label}
              to={"/admin" + path}
              className={tab === (path.slice(1) || "dashboard") ? "chip active" : "chip"}
            >
              {label}
            </Link>
          )
        )}
      </div>

      {/* ---------- DASHBOARD ---------- */}
      {tab === "dashboard" && (
        <>
          <div className="stat-grid">
            <div className="stat-card"><FaRupeeSign /><h2>{revenue.toLocaleString("en-IN")}</h2><span>Total Revenue</span></div>
            <div className="stat-card green"><FaClipboardList /><h2>{orders.length}</h2><span>Orders</span></div>
            <div className="stat-card blue"><FaBoxes /><h2>{products.length}</h2><span>Products</span></div>
            <div className="stat-card red"><FaExclamationTriangle /><h2>{lowStock}</h2><span>Low Stock</span></div>
          </div>

          {orders.length === 0 ? (
            <p className="empty">Charts will appear after the first order.</p>
          ) : (
            <div className="charts">
              <div className="chart-box">
                <h3>Orders by Status</h3>
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {statusData.map((d) => (
                        <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-box">
                <h3>Top Selling Products</h3>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={topData}>
                    <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
                    <YAxis allowDecimals={false} stroke="currentColor" />
                    <Tooltip />
                    <Bar dataKey="qty" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------- PRODUCTS ---------- */}
      {tab === "products" && (
        <>
          <div className="form-card" style={{ marginBottom: 20 }}>
            <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
            <div className="form-grid">
              <input name="name" placeholder="Product name" value={form.name} onChange={change} />
              <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={change} />
              <input name="stock" type="number" placeholder="Stock quantity" value={form.stock} onChange={change} />
              <input name="category" placeholder="Category (e.g. Fashion)" value={form.category} onChange={change} />
              <input name="emoji" placeholder="Emoji icon (e.g. 👕)" value={form.emoji} onChange={change} />
              <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={change} />
              <input className="wide" name="description" placeholder="Short description" value={form.description} onChange={change} />
            </div>
            <div className="form-btns">
              <button className="add-btn" onClick={saveProduct}>
                {editId ? "Update Product" : "Add Product"}
              </button>
              {editId && (
                <button className="chip" onClick={() => { setEditId(null); setForm(EMPTY); }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.emoji}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price.toLocaleString("en-IN")}</td>
                    <td className={p.stock <= 5 ? "low" : ""}>{p.stock}</td>
                    <td>
                      <button className="action edit" onClick={() => startEdit(p)}><FaEdit /></button>
                      <button className="action delete" onClick={() => deleteProduct(p._id)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ---------- ORDERS ---------- */}
      {tab === "orders" && (
        <>
          {orders.length === 0 && <p className="empty">No orders yet.</p>}
          {orders.map((o) => (
            <div className="order-card" key={o._id}>
              <div className="order-top">
                <div>
                  <strong>#{o._id.slice(-6).toUpperCase()}</strong>
                  <span className="muted">
                    {" "}· {o.user ? o.user.name : "Deleted user"} · {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <select
                  className="select"
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
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
                <span className="muted">{o.address} · 📞 {o.phone}</span>
                <b>₹{o.total.toLocaleString("en-IN")}</b>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ---------- MESSAGES ---------- */}
      {tab === "messages" && (
        <>
          {messages.length === 0 && <p className="empty">No messages yet.</p>}
          {messages.map((m) => (
            <div className="order-card" key={m._id}>
              <div className="order-top">
                <strong>{m.name}</strong>
                <span className="muted">{m.email} · {new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{m.message}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Admin;