import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [] }); // Use 'products' not 'items'

  const refreshCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token, clearing cart");
      setCart({ products: [] });
      return;
    }

    try {
      console.log("Refreshing cart...");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Cart refreshed:", data);
        setCart(data);
      } else if (res.status === 401) {
        console.log("Unauthorized, clearing cart");
        setCart({ products: [] });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        console.error("Failed to refresh cart:", res.status);
      }
    } catch (err) {
      console.error("Cart refresh error:", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      console.log("Adding to cart:", { productId, quantity });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [{ product: productId, quantity }],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Successfully added to cart");
        setCart(data);
        return true;
      } else {
        console.error("Failed to add to cart:", data.message);
        alert(data.message || "Failed to add to cart");
        return false;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding product to cart");
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  // Load cart on component mount
  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
