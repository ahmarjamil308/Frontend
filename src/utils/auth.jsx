export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

// For demo purposes, decode token as JSON stored in localStorage
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])); // simulate JWT
  } catch {
    return null;
  }
};
