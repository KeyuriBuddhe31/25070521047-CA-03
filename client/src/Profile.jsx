import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "./api";

function Profile({ user, updateUser, logout }) {
  const [name, setName] = useState(user.name);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api("/orders/mine").then(setOrders).catch(() => {});
  }, []);

  const spent = orders.reduce((s, o) => s + o.total, 0);

  const save = async () => {
    try {
      const u = await api("/me", "PUT", { name });
      updateUser({ ...user, name: u.name });
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="profile-card">
      <div className="avatar">{user.name[0].toUpperCase()}</div>
      <h2>{user.name}</h2>
      <span className={user.role === "admin" ? "status shipped" : "status delivered"}>
        {user.role === "admin" ? "Admin" : "Customer"}
      </span>
      <p className="muted" style={{ margin: "10px 0 20px" }}>{user.email}</p>

      <div className="stat-grid two">
        <div className="stat-card"><h2>{orders.length}</h2><span>Orders placed</span></div>
        <div className="stat-card green"><h2>₹{spent.toLocaleString("en-IN")}</h2><span>Total spent</span></div>
      </div>

      <div className="form-grid one">
        <label className="muted">Change your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="btn-row" style={{ justifyContent: "center", marginTop: 14 }}>
        <button className="add-btn" onClick={save}>Save Changes</button>
        <button className="btn-outline" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;