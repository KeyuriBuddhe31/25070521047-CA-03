require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Models ----------
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
  )
);

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String, default: "" },
      price: { type: Number, required: true, min: 0 },
      category: { type: String, default: "General" },
      stock: { type: Number, default: 0, min: 0 },
      emoji: { type: String, default: "🛍️" },
      image: { type: String, default: "" },
      rating: { type: Number, default: 4.5 },
    },
    { timestamps: true }
  )
);

const Order = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      items: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          name: String,
          price: Number,
          qty: Number,
          emoji: String,
        },
      ],
      total: { type: Number, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
    },
    { timestamps: true }
  )
);

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      message: { type: String, required: true },
    },
    { timestamps: true }
  )
);

// ---------- Sample products (added automatically if the shop is empty) ----------
const sampleProducts = [
  { name: "Wireless Headphones", description: "Noise-cancelling, 30 hour battery", price: 1999, category: "Electronics", stock: 15, emoji: "🎧", rating: 4.6 },
  { name: "Smart Watch", description: "Heart-rate, steps and sleep tracking", price: 2999, category: "Electronics", stock: 10, emoji: "⌚", rating: 4.4 },
  { name: "Power Bank 20000mAh", description: "Fast charging, dual USB ports", price: 1299, category: "Electronics", stock: 25, emoji: "🔋", rating: 4.5 },
  { name: "Bluetooth Speaker", description: "Waterproof with deep bass", price: 1799, category: "Electronics", stock: 12, emoji: "🔊", rating: 4.3 },
  { name: "Running Sneakers", description: "Lightweight and comfortable", price: 2499, category: "Fashion", stock: 20, emoji: "👟", rating: 4.7 },
  { name: "Travel Backpack", description: "35L, water resistant", price: 1199, category: "Fashion", stock: 18, emoji: "🎒", rating: 4.5 },
  { name: "Sunglasses", description: "UV400 protection", price: 899, category: "Fashion", stock: 30, emoji: "🕶️", rating: 4.2 },
  { name: "Coffee Mug", description: "Ceramic, 350ml", price: 349, category: "Home", stock: 40, emoji: "☕", rating: 4.8 },
  { name: "LED Desk Lamp", description: "Adjustable brightness, USB powered", price: 799, category: "Home", stock: 22, emoji: "💡", rating: 4.4 },
  { name: "Indoor Plant", description: "Low maintenance, comes with pot", price: 499, category: "Home", stock: 3, emoji: "🪴", rating: 4.9 },
];

// ---------- Connect to MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    if ((await Product.countDocuments()) === 0) {
      await Product.insertMany(sampleProducts);
      console.log("Sample products added");
    }
  })
  .catch((err) => console.log("DB error:", err.message));

// ---------- Helpers & middleware ----------
const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.id;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ message: "Please login again" });
  }
}

function adminOnly(req, res, next) {
  if (req.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
}

const isAdminEmail = (email) =>
  (process.env.ADMIN_EMAIL || "").toLowerCase() === (email || "").toLowerCase();

const pickProduct = (body) => {
  const out = {};
  ["name", "description", "price", "category", "stock", "emoji", "image"].forEach((k) => {
    if (body[k] !== undefined) out[k] = body[k];
  });
  return out;
};

// ---------- Auth routes ----------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: isAdminEmail(email) ? "admin" : "user",
    });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password || "", user.password);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

    if (isAdminEmail(user.email) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Update my profile
app.put("/api/me", auth, async (req, res) => {
  const name = (req.body.name || "").trim();
  if (name.length < 2)
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true });
  res.json(publicUser(user));
});

// ---------- Product routes ----------
app.get("/api/products", async (req, res) => {
  res.json(await Product.find().sort({ createdAt: -1 }));
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

app.post("/api/products", auth, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Product.create(pickProduct(req.body)));
  } catch {
    res.status(400).json({ message: "Invalid product data" });
  }
});

app.put("/api/products/:id", auth, adminOnly, async (req, res) => {
  try {
    res.json(await Product.findByIdAndUpdate(req.params.id, pickProduct(req.body), { new: true }));
  } catch {
    res.status(400).json({ message: "Could not update product" });
  }
});

app.delete("/api/products/:id", auth, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ---------- Order routes ----------
app.post("/api/orders", auth, async (req, res) => {
  try {
    const { items, address, phone } = req.body;
    if (!items || items.length === 0 || !address || !phone)
      return res.status(400).json({ message: "Cart, address and phone are required" });

    const orderItems = [];
    let total = 0;

    // Check every item using the REAL price and stock from the database
    for (const it of items) {
      const p = await Product.findById(it.productId);
      const qty = Number(it.qty);
      if (!p || !qty || qty < 1)
        return res.status(400).json({ message: "Invalid item in cart" });
      if (p.stock < qty)
        return res.status(400).json({ message: `Only ${p.stock} left of ${p.name}` });

      orderItems.push({ product: p._id, name: p.name, price: p.price, qty, emoji: p.emoji });
      total += p.price * qty;
    }

    // Everything is valid, so reduce stock
    for (const it of orderItems) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      total,
      address,
      phone,
    });
    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: "Could not place order" });
  }
});

// My orders
app.get("/api/orders/mine", auth, async (req, res) => {
  res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 }));
});

// All orders (admin)
app.get("/api/orders", auth, adminOnly, async (req, res) => {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
});

// Change order status (admin)
app.put("/api/orders/:id", auth, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    res.json(order);
  } catch {
    res.status(400).json({ message: "Invalid status" });
  }
});

// ---------- Contact form ----------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "All fields are required" });
  await Message.create({ name, email, message });
  res.status(201).json({ message: "Message sent" });
});

app.get("/api/messages", auth, adminOnly, async (req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }));
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port " + (process.env.PORT || 5000))
);