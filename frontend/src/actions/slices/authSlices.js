import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    isAuthenticated: false,
    isNewUser: true,
    role: "viewer",
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      state.isNewUser = action.payload.isNewUser ?? true;
      state.role = action.payload.role ?? "viewer";
    },
    setOnboardingComplete: (state) => {
      state.isNewUser = false;
    },
    logout: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
      state.isNewUser = true;
      state.role = "viewer";
    },
  },
});

export const { setUser, setOnboardingComplete, logout } = authSlice.actions;
export default authSlice.reducer;
