import { Link } from "react-router-dom";

const TECH = [
  { icon: "🍃", name: "MongoDB", text: "Stores users, products and orders" },
  { icon: "⚡", name: "Express.js", text: "Builds the REST API" },
  { icon: "⚛️", name: "React", text: "Creates the pages you see" },
  { icon: "🟢", name: "Node.js", text: "Runs the server" },
];

function About() {
  return (
    <div>
      <h2 className="page-title">About ShopEase</h2>
      <div className="panel">
        <p>
          ShopEase is a full-stack e-commerce web application. Customers can create an account,
          browse products, add them to a cart and place orders. Admins can manage products,
          track orders and read customer messages.
        </p>
        <p style={{ marginTop: 12 }}>
          Our goal is to make online shopping simple, fast and secure.
        </p>
      </div>

      <h2 className="section-title">Technology we use</h2>
      <div className="info-grid">
        {TECH.map((t) => (
          <div className="info-card" key={t.name}>
            <div className="ic">{t.icon}</div>
            <h4>{t.name}</h4>
            <p className="muted">{t.text}</p>
          </div>
        ))}
      </div>

      <div className="cta">
        <h2>Have a question?</h2>
        <p>We would love to hear from you.</p>
        <Link to="/contact" className="add-btn white">Contact Us</Link>
      </div>
    </div>
  );
}

export default About;