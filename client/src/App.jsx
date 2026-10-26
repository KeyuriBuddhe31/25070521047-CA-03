import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Shop from "./Shop";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import Orders from "./Orders";
import Profile from "./Profile";
import About from "./About";
import Contact from "./Contact";
import Auth from "./Auth";
import Admin from "./Admin";
import "./App.css";

// Scrolls to the top whenever the page changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Blocks a page unless the user is logged in (and is admin, if required)
function Protected({ user, admin, children }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function NotFound() {
  return (
    <div className="center-card">
      <div className="big-emoji">🧭</div>
      <h2>404 - Page not found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="add-btn">Go Home</Link>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("shopUser") || "null"));
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("shopCart") || "[]"));

  useEffect(() => {
    localStorage.setItem("shopCart", JSON.stringify(cart));
  }, [cart]);

  // ----- Auth -----
  const handleLogin = (data) => {
    localStorage.setItem("shopToken", data.token);
    localStorage.setItem("shopUser", JSON.stringify(data.user));
    setUser(data.user);
  };

  const updateUser = (u) => {
    localStorage.setItem("shopUser", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("shopToken");
    localStorage.removeItem("shopUser");
    setUser(null);
    toast("Logged out", { icon: "👋" });
    navigate("/");
  };

  // ----- Cart -----
  const addToCart = (p, qty = 1) => {
    const found = cart.find((i) => i._id === p._id);
    const newQty = (found ? found.qty : 0) + qty;
    if (newQty > p.stock) return toast.error(`Only ${p.stock} in stock`);
    if (found) {
      setCart(cart.map((i) => (i._id === p._id ? { ...i, qty: newQty } : i)));
    } else {
      setCart([
        ...cart,
        { _id: p._id, name: p.name, price: p.price, emoji: p.emoji, image: p.image, stock: p.stock, qty },
      ]);
    }
    toast.success("Added to cart");
  };

  const changeQty = (id, delta) =>
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, qty: Math.min(i.stock, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) => setCart(cart.filter((i) => i._id !== id));

  const onOrdered = (order) => {
    setCart([]);
    navigate("/order-success", { state: { orderId: order._id } });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className={dark ? "app dark" : "app"}>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Navbar user={user} logout={logout} dark={dark} setDark={setDark} cartCount={cartCount} />

      <main className="main">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route
            path="/cart"
            element={
              <Cart cart={cart} user={user} changeQty={changeQty} removeItem={removeItem} clearCart={() => setCart([])} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth key="login" mode="login" onLogin={handleLogin} />} />
          <Route path="/register" element={<Auth key="register" mode="register" onLogin={handleLogin} />} />

          {/* Logged-in pages */}
          <Route
            path="/checkout"
            element={<Protected user={user}><Checkout cart={cart} onOrdered={onOrdered} /></Protected>}
          />
          <Route
            path="/order-success"
            element={<Protected user={user}><OrderSuccess /></Protected>}
          />
          <Route path="/orders" element={<Protected user={user}><Orders /></Protected>} />
          <Route
            path="/profile"
            element={<Protected user={user}><Profile user={user} updateUser={updateUser} logout={logout} /></Protected>}
          />

          {/* Admin pages */}
          <Route path="/admin" element={<Protected user={user} admin><Admin tab="dashboard" /></Protected>} />
          <Route path="/admin/products" element={<Protected user={user} admin><Admin tab="products" /></Protected>} />
          <Route path="/admin/orders" element={<Protected user={user} admin><Admin tab="orders" /></Protected>} />
          <Route path="/admin/messages" element={<Protected user={user} admin><Admin tab="messages" /></Protected>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;