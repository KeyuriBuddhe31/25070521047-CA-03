import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { api } from "./api";
import ProductCard from "./ProductCard";

function Shop({ addToCart }) {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("cat") || "All");
  const [sort, setSort] = useState("new");

  useEffect(() => {
    api("/products")
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const list = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);

  return (
    <div>
      <h2 className="page-title">All Products</h2>

      <div className="toolbar">
        <div className="search">
          <FaSearch />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Newest first</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "chip active" : "chip"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="empty">Loading products...</p>}
      {!loading && list.length === 0 && <p className="empty">No products found 😕</p>}

      <div className="grid">
        {list.map((p, i) => (
          <ProductCard key={p._id} p={p} index={i} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default Shop;