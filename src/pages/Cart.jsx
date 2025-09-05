import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Cart() {
  const { cart, setCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data);
        } else {
          console.error("Failed to fetch cart:", res.status);
        }
      } catch (err) {
        console.error("Cart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCart]);

  // Calculate total
  useEffect(() => {
    const t = cart.products?.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    );
    setTotal(t || 0);
  }, [cart]);

  // Update quantity API call
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 0) return;
    if (newQuantity === 0) {
      await removeFromCart(productId);
      return;
    }

    setUpdating((prev) => ({ ...prev, [productId]: true }));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to update cart");
        return;
      }

      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [{ product: productId, quantity: newQuantity }],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error updating cart");
      }
    } catch (err) {
      console.error("Update quantity error:", err);
      alert("Error updating cart. Please try again.");
    } finally {
      setUpdating((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm("Remove this item from cart?")) {
      await removeFromCart(productId);
    }
  };

  const handleCheckout = async () => {
    if (!cart.products || cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed with checkout");
      return;
    }

    setCheckoutLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate API
      alert(
        `Checkout successful! Total amount: $${total.toFixed(
          2
        )}\n\nOrder details:\n${cart.products
          .map(
            (item) =>
              `${item.product.name} x${item.quantity} - $${(
                item.product.price * item.quantity
              ).toFixed(2)}`
          )
          .join("\n")}`
      );

      setCart({ products: [] });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (!cart.products || cart.products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Your Cart ({cart.products.length} items)
      </h2>

      {cart.products.map((item) => (
        <div
          key={item.product._id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "15px",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            opacity: updating[item.product._id] ? 0.6 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <img
            src={item.product.image}
            alt={item.product.name}
            style={{
              width: "100px",
              height: "100px",
              marginRight: "20px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZjlmOSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
            }}
          />

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
              {item.product.name}
            </h3>
            <p
              style={{
                color: "#4CAF50",
                fontWeight: "bold",
                margin: "5px 0",
                fontSize: "16px",
              }}
            >
              ${item.product.price.toFixed(2)}
            </p>
            {item.product.description && (
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  margin: "5px 0",
                  lineHeight: "1.4",
                }}
              >
                {item.product.description}
              </p>
            )}
          </div>

          {/* Quantity Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginRight: "15px",
            }}
          >
            <button
              onClick={() => {
                const newQty = Math.max(1, item.quantity - 1);
                setCart((prev) => {
                  const updatedProducts = prev.products.map((p) =>
                    p.product._id === item.product._id
                      ? { ...p, quantity: newQty }
                      : p
                  );
                  return { ...prev, products: updatedProducts };
                });
                updateQuantity(item.product._id, newQty);
              }}
              disabled={updating[item.product._id] || item.quantity <= 1}
            >
              -
            </button>

            <span>{updating[item.product._id] ? "..." : item.quantity}</span>

            <button
              onClick={() => {
                const newQty = item.quantity + 1;
                setCart((prev) => {
                  const updatedProducts = prev.products.map((p) =>
                    p.product._id === item.product._id
                      ? { ...p, quantity: newQty }
                      : p
                  );
                  return { ...prev, products: updatedProducts };
                });
                updateQuantity(item.product._id, newQty);
              }}
              disabled={updating[item.product._id]}
            >
              +
            </button>

            <button
              onClick={() => handleRemoveItem(item.product._id)}
              disabled={updating[item.product._id]}
              style={{
                marginLeft: "10px",
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 12px",
                cursor: updating[item.product._id] ? "not-allowed" : "pointer",
              }}
            >
              {updating[item.product._id] ? "..." : "Remove"}
            </button>
          </div>

          <div
            style={{
              marginLeft: "15px",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#2c3e50",
              minWidth: "80px",
              textAlign: "right",
            }}
          >
            ${(item.product.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}

      {/* Checkout */}
      <div
        style={{
          textAlign: "right",
          marginTop: "30px",
          padding: "25px",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          border: "2px solid #e9ecef",
        }}
      >
        <h2>Total: ${total.toFixed(2)}</h2>

        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          style={{
            padding: "15px 30px",
            backgroundColor: checkoutLoading ? "#95d5b2" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: checkoutLoading ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}
