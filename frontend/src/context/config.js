export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://silverscreen.onrender.com/api"
    : "http://localhost:5000/api";
