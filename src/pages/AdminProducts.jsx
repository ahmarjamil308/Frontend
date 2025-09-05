import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (product) => setEditingProduct(product);
  const handleFormSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Admin Products
      </h1>
      <ProductForm
        productToEdit={editingProduct}
        onSuccess={handleFormSuccess}
      />

      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "15px" }}>Product List</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                  Price
                </th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    {p.name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                    ${p.price}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() => handleEdit(p)}
                      style={{ padding: "5px 10px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        backgroundColor: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
