import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { refreshCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [{ product: product._id, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Product added to cart!");
        refreshCart();
      } else alert(data.message || "Failed to add to cart");
    } catch (err) {
      console.error(err);
      alert("Error adding product to cart");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "300px",
          height: "300px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />
      <h2 style={{ margin: "20px 0" }}>{product.name}</h2>
      <p style={{ fontWeight: "bold", fontSize: "18px", color: "#4CAF50" }}>
        ${product.price}
      </p>
      <p style={{ margin: "10px 0", color: "#555" }}>{product.description}</p>
      <button
        onClick={addToCart}
        style={{
          padding: "12px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
