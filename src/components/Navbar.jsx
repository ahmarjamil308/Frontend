import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ROUTES from "../utils/routes";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role || "guest";

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 30px",
        background: "#4CAF50",
        color: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{ cursor: "pointer", fontSize: "24px", fontWeight: "bold" }}
        onClick={() => navigate("/")}
      >
        E-Shop
      </h1>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <button style={navBtnStyle} onClick={() => navigate(ROUTES.HOME)}>
          Home
        </button>
        <button style={navBtnStyle} onClick={() => navigate(ROUTES.PRODUCTS)}>
          Products
        </button>
        <button style={navBtnStyle} onClick={() => navigate(ROUTES.CART)}>
          Cart
        </button>
        {!user && (
          <>
            <button style={navBtnStyle} onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </button>
            <button style={navBtnStyle} onClick={() => navigate(ROUTES.SIGNUP)}>
              Sign Up
            </button>
          </>
        )}
        {user && (
          <>
            <span>Hi, {user.name}</span>
            {role === "admin" && (
              <button
                style={navBtnStyle}
                onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
              >
                Manage Products
              </button>
            )}
            <button
              style={{ ...navBtnStyle, background: "#ff4d4f", color: "#fff" }}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const navBtnStyle = {
  padding: "6px 12px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  background: "#fff",
  color: "#4CAF50",
  fontWeight: "bold",
  transition: "0.2s",
};

export default Navbar;
