# 🛍️ ShopEase - Full-Stack E-commerce Web Application

ShopEase is a multi-page e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Customers can register, browse products, add them to a cart and place orders. Admins get a separate panel to manage products, track orders, view sales analytics and read customer messages.

> Mini project | Developed by **Keyuri** | 25070521047

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages (16)](#-pages)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Admin Account](#-admin-account)
- [API Endpoints](#-api-endpoints)
- [Database Collections](#-database-collections)
- [Security Features](#-security-features)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Future Scope](#-future-scope)

---

## ✨ Features

### Customer side
- Register and login with secure authentication (JWT + bcrypt)
- Browse products with **search, category filter and price sorting**
- Product details page with quantity selector and stock status
- **Shopping cart** that survives page refresh (saved in localStorage)
- **Checkout** with address, pincode and phone validation (Cash on Delivery)
- **Order tracking**: Pending → Shipped → Delivered
- Profile page with order count, total spent and editable name
- Contact form (messages are saved in the database)
- Dark mode, animations, confetti on successful order, toast notifications
- Fully responsive design (mobile, tablet, desktop)

### Admin side
- Dashboard with total revenue, orders, products and low-stock alerts
- Charts: orders by status and top-selling products
- Add, edit and delete products (full CRUD)
- View all orders and update their status
- Read messages sent from the Contact page

### Smart behaviour
- **Protected routes**: guests are redirected to login and returned to their page afterwards
- **Role-based access**: normal users cannot open admin pages or admin APIs
- Stock reduces automatically when an order is placed
- The server recalculates prices from the database, so prices cannot be tampered with
- 10 sample products are added automatically on first run

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Database | MongoDB (viewed with MongoDB Compass) |
| Backend | Node.js, Express.js, Mongoose |
| Frontend | React (Vite), React Router |
| Authentication | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Charts | Recharts |
| UI extras | react-icons, framer-motion, react-hot-toast, canvas-confetti |
| Language | JavaScript (ES6+) |

---

## 📄 Pages

| # | Page | Route | Access |
|---|---|---|---|
| 1 | Home | `/` | Everyone |
| 2 | Login | `/login` | Everyone |
| 3 | Register | `/register` | Everyone |
| 4 | Shop | `/shop` | Everyone |
| 5 | Product Details | `/product/:id` | Everyone |
| 6 | Cart | `/cart` | Everyone |
| 7 | Checkout | `/checkout` | Logged-in users |
| 8 | Order Success | `/order-success` | Logged-in users |
| 9 | My Orders | `/orders` | Logged-in users |
| 10 | Profile | `/profile` | Logged-in users |
| 11 | About | `/about` | Everyone |
| 12 | Contact | `/contact` | Everyone |
| 13 | Admin Dashboard | `/admin` | Admin only |
| 14 | Admin Products | `/admin/products` | Admin only |
| 15 | Admin Orders | `/admin/orders` | Admin only |
| 16 | Admin Messages | `/admin/messages` | Admin only |
| - | 404 Not Found | any other route | Everyone |

---

## 📁 Project Structure

```
shopease/
├── README.md
├── server/
│   ├── server.js          # Express app, models, middleware and all API routes
│   ├── package.json
│   └── .env               # Secret settings (not shared)
└── client/
    ├── index.html
    ├── package.json
    └── src/
        ├── main.jsx       # App entry, enables routing
        ├── App.jsx        # Routes, cart state, login state, protected routes
        ├── App.css        # All styling (light and dark theme)
        ├── index.css      # Empty
        ├── api.js         # Helper for calling the backend
        ├── Navbar.jsx
        ├── Footer.jsx
        ├── ProductCard.jsx
        ├── Home.jsx
        ├── Auth.jsx       # Login and Register pages
        ├── Shop.jsx
        ├── ProductDetails.jsx
        ├── Cart.jsx
        ├── Checkout.jsx
        ├── OrderSuccess.jsx
        ├── Orders.jsx
        ├── Profile.jsx
        ├── About.jsx
        ├── Contact.jsx
        └── Admin.jsx      # Admin dashboard, products, orders and messages
```

---

## ✅ Prerequisites

Install these before starting:

1. **Node.js** (LTS version) - https://nodejs.org
2. **MongoDB Community Server** - https://www.mongodb.com/try/download/community
   (choose "Install as a Service" so it starts automatically)
3. **MongoDB Compass** (optional, to view the data)
4. **VS Code** (or any editor)

Check your installation:

```bash
node -v
npm -v
```

---

## ⚙️ Installation and Setup

### 1. Get the project

Extract the project folder and open it in VS Code.

### 2. Install backend packages

```bash
cd server
npm install
```

### 3. Install frontend packages

Open a second terminal:

```bash
cd client
npm install
```

> If the `package.json` files are missing the packages, install them manually:
>
> **Server:** `npm install express mongoose cors dotenv bcryptjs jsonwebtoken` and `npm install -D nodemon`
>
> **Client:** `npm install react-icons recharts react-hot-toast framer-motion canvas-confetti react-router-dom`

### 4. Create the environment file

Create a file named `.env` inside the `server` folder (see the next section).

---

## 🔐 Environment Variables

Create `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/shopdb
JWT_SECRET=choose_any_long_random_text
PORT=5000
ADMIN_EMAIL=your_email@gmail.com
```

| Variable | Meaning |
|---|---|
| `MONGO_URI` | Address of your MongoDB database (`shopdb` is created automatically) |
| `JWT_SECRET` | Secret key used to sign login tokens |
| `PORT` | Port for the backend server |
| `ADMIN_EMAIL` | The account registered with this email becomes the admin |

> ⚠️ Never upload your `.env` file to GitHub or share it publicly.

---

## ▶️ Running the Project

Make sure **MongoDB is running** (Windows: Services → MongoDB Server → Running).

**Terminal 1 - Backend**

```bash
cd server
npm run dev
```

Expected output:

```
Server running on port 5000
MongoDB connected
Sample products added
```

**Terminal 2 - Frontend**

```bash
cd client
npm run dev
```

Open the link shown in the terminal (usually **http://localhost:5173**).

> Both terminals must stay open while using the app.

---

## 👑 Admin Account

1. Set `ADMIN_EMAIL` in `server/.env` to your email.
2. Open the app and **register using that exact email**.
3. After login, an **Admin** link appears in the top bar.

If you registered before setting `ADMIN_EMAIL`, fix the `.env`, then logout and login again. The role is upgraded automatically at login.

Any other email registers as a normal **customer**.

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create an account |
| POST | `/login` | Public | Login and receive a JWT token |
| PUT | `/me` | Logged in | Update own name |
| GET | `/products` | Public | List all products |
| GET | `/products/:id` | Public | Get one product |
| POST | `/products` | Admin | Add a product |
| PUT | `/products/:id` | Admin | Edit a product |
| DELETE | `/products/:id` | Admin | Delete a product |
| POST | `/orders` | Logged in | Place an order |
| GET | `/orders/mine` | Logged in | Get own orders |
| GET | `/orders` | Admin | Get all orders |
| PUT | `/orders/:id` | Admin | Update order status |
| POST | `/contact` | Public | Send a contact message |
| GET | `/messages` | Admin | Read contact messages |

Protected routes need the header `Authorization: Bearer <token>`. The frontend adds it automatically.

---

## 🗄️ Database Collections

Database name: **shopdb**

| Collection | Main fields |
|---|---|
| **users** | name, email (unique), password (hashed), role (`user` or `admin`) |
| **products** | name, description, price, category, stock, emoji, image, rating |
| **orders** | user, items (product, name, price, qty), total, address, phone, status (`Pending` / `Shipped` / `Delivered`) |
| **messages** | name, email, message |

---

## 🛡️ Security Features

- Passwords are **hashed with bcrypt** and never stored as plain text
- Login uses **JWT tokens** that expire after 7 days
- **Middleware** protects private routes (`auth`) and admin routes (`adminOnly`)
- **Frontend route protection** redirects guests to login and non-admins away from admin pages
- Order totals are **recalculated on the server** from database prices
- Stock is **validated before** an order is created
- Input validation on both the frontend (forms) and backend (routes)
- Only allowed fields are accepted when creating or updating data

---

## 📸 Screenshots

Create a `screenshots` folder next to this README, save your images there and keep the names below (or change the paths).

| Page | Screenshot |
|---|---|
| Home | `![Home](screenshots/home.png)` |
| Shop | `![Shop](screenshots/shop.png)` |
| Product Details | `![Product](screenshots/product.png)` |
| Cart | `![Cart](screenshots/cart.png)` |
| Checkout | `![Checkout](screenshots/checkout.png)` |
| My Orders | `![Orders](screenshots/orders.png)` |
| Admin Dashboard | `![Admin](screenshots/admin-dashboard.png)` |
| MongoDB Compass | `![Compass](screenshots/compass.png)` |

---

## 🧯 Troubleshooting

| Problem | Solution |
|---|---|
| `npm` blocked by PowerShell ("running scripts is disabled") | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, then open a new terminal |
| `DB error: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running. Start **MongoDB Server** in Windows Services |
| "Failed to fetch" in the browser | The backend is not running. Start it with `npm run dev` inside `server` |
| `Cannot find module 'server.js'` | You are in the wrong folder. Run the command from inside `server` |
| `Failed to resolve import "./Something"` | A file in `client/src` is missing or misspelled (names are case-sensitive) |
| No Admin link after registering | The email must match `ADMIN_EMAIL` exactly. Fix `.env`, then logout and login again |
| Port already in use | Close the old terminal still running the app, or change `PORT` in `.env` |
| Page looks unstyled | Check that `App.css` contains the styles and is imported in `App.jsx` |

---

## 🚀 Future Scope

- Online payment integration (Razorpay or Stripe)
- Product image upload
- Reviews and ratings by customers
- Wishlist
- Email notifications for orders
- Pagination and advanced filters
- Password reset (forgot password)
- Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## 👩‍💻 Author

**Keyuri**

---

*Built as a mini project to demonstrate full-stack development with the MERN stack.*
