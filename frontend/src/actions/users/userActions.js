import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/users", // change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to attach token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get current user profile
export async function getProfile() {
  try {
    const res = await axiosInstance.get("/profile", getAuthHeaders());
    return { success: true, user: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch profile",
    };
  }
}

// Update profile
export async function updateProfile({ email, username }) {
  try {
    const res = await axiosInstance.put(
      "/profile",
      { email, username },
      getAuthHeaders()
    );
    return { success: true, user: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Update failed",
    };
  }
}

// Get all users (for admin or dashboard)
export async function getAllUsers() {
  try {
    const res = await axiosInstance.get("/", getAuthHeaders());
    return { success: true, users: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Could not fetch users",
    };
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const res = await axiosInstance.get(`/${userId}`, getAuthHeaders());
    return { success: true, user: res.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "User not found",
    };
  }
}

// Delete user by ID
export async function deleteUser(userId) {
  try {
    const res = await axiosInstance.delete(`/${userId}`, getAuthHeaders());
    return { success: true, message: res.data.message };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Delete failed",
    };
  }
}
