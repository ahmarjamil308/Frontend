import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const apiUrl = `${import.meta.env.VITE_API_URL}/auth/signup`;
    console.log("Making request to:", apiUrl);
    console.log("Form data:", formData);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      console.log(
        "Response headers:",
        Object.fromEntries(res.headers.entries())
      );

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) throw new Error(data.message || "Signup failed");

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);

      // Provide more specific error messages
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError(
          "Cannot connect to server. Please check if the backend is running on http://localhost:5000"
        );
      } else if (err.message.includes("CORS")) {
        setError("CORS error - server configuration issue");
      } else {
        setError(err.message || "Network error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Test server connection
  const testConnection = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      if (res.ok) {
        alert("Server connection successful!");
      } else {
        alert("Server responded but with an error");
      }
    } catch (err) {
      alert("Cannot connect to server: " + err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Sign Up</h2>

        {/* Debug info */}
        <p style={{ fontSize: "12px", color: "#666" }}>
          API URL: {import.meta.env.VITE_API_URL}
        </p>

        <button
          type="button"
          onClick={testConnection}
          style={{ ...btnStyle, backgroundColor: "#2196F3" }}
        >
          Test Server Connection
        </button>

        {error && (
          <div
            style={{
              color: "red",
              fontSize: "14px",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        )}

        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f0f2f5",
  fontFamily: "Arial, sans-serif",
};

const formStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "350px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "14px",
};

const btnStyle = {
  padding: "10px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Signup;
