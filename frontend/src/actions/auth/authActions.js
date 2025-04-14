import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Update to your production URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Register API
export async function registerUser({ email, username, password }) {
  try {
    const res = await axiosInstance.post("/register", {
      email,
      username,
      password,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return { success: true, user: res.data.user };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Something went wrong!",
    };
  }
}

// Login API
export async function loginUser({ username, password }) {
  try {
    const res = await axiosInstance.post("/login", {
      username,
      password,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return { success: true, user: res.data.user };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Invalid credentials",
    };
  }
}
// Logout function (client-side only)
export function logoutUser() {
  localStorage.removeItem("token");
  // Optional: clear other user data from localStorage if stored
  // localStorage.removeItem("user");
  return { success: true, message: "Logged out successfully" };
}
