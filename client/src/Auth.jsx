import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "./api";

function Auth({ mode, onLogin }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const from = useLocation().state?.from || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api(isLogin ? "/login" : "/register", "POST", form);
      onLogin(data);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>🛍️ ShopEase</h1>
        <p className="sub">{isLogin ? "Welcome back! Please login." : "Create your account."}</p>

        {!isLogin && (
          <input name="name" placeholder="Full name" value={form.name} onChange={change} />
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={change}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {error && <div className="error">{error}</div>}

        <button className="add-btn full" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className="switch">
          {isLogin ? "New here? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"} state={{ from }}>
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Auth;