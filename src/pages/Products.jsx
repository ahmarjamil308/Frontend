import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products from:", `${API_URL}/products`);
        const res = await fetch(`${API_URL}/products`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Products fetched:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Expected array, got:", typeof data);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(`Failed to load products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [{ product: productId, quantity: 1 }] }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product added to cart!");
        refreshCart();
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert("Error adding product to cart");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>No products available.</p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Make sure to run the seed script to populate the database.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Products ({products.length})
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              backgroundColor: "#fff",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                borderRadius: "10px",
                height: "180px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/products/${product._id}`)}
              onError={(e) => {
                e.target.src = "/products/placeholder.jpg"; // Fallback image
                console.log("Image load error for:", product.image);
              }}
            />
            <h3 style={{ margin: "10px 0", fontSize: "16px" }}>
              {product.name}
            </h3>
            <p
              style={{ fontWeight: "bold", color: "#4CAF50", fontSize: "18px" }}
            >
              ${product.price}
            </p>
            {product.description && (
              <p style={{ fontSize: "14px", color: "#666", margin: "5px 0" }}>
                {product.description}
              </p>
            )}
            <button
              onClick={() => addToCart(product._id)}
              style={{
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
