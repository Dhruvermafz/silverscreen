import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL of your API (replace with your backend's base URL)
const baseUrl = "http://localhost:5000/api/auth/"; // Replace with the actual API URL

export const authApi = createApi({
  reducerPath: "authApi", // Defines the slice name for the state
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from localStorage and set it in the Authorization header if available
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Register endpoint
    register: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      // Handle the response to store the JWT token in localStorage
      onQuerySucceeded: (response) => {
        if (response?.data?.token) {
          // Store the JWT token in localStorage
          localStorage.setItem("jwtToken", response.data.token);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
