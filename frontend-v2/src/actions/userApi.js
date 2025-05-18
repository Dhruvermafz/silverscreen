import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const userApi = createApi({
  reducerPath: "userApi", // Name for this slice
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Adjust to match your Express server's URL
  endpoints: (builder) => ({
    // Fetch the logged-in user's profile
    getProfile: builder.query({
      query: () => "/users/profile", // GET /profile
    }),

    // Update the logged-in user's profile
    updateProfile: builder.mutation({
      query: (updatedData) => ({
        url: "/users/profile", // PUT /profile
        method: "PUT",
        body: updatedData, // Send the updated profile data
      }),
    }),

    // Fetch all users
    getAllUsers: builder.query({
      query: () => "/users", // GET /users
    }),

    // Fetch a user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`, // GET /users/:id
    }),

    // Delete a user by ID
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`, // DELETE /users/:id
        method: "DELETE",
      }),
    }),
    followUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: "POST",
      }),
    }),
    getUserReviews: builder.query({
      query: (userId) => `/users/${userId}/reviews`,
    }),
    getUserRequests: builder.query({
      query: (userId) => `/users/${userId}/requests`,
    }),
    // Unfollow user
    unfollowUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/unfollow`,
        method: "POST",
      }),
    }),
    // Fetch all members (additional route)
    getAllMembers: builder.query({
      query: () => "/users/", // GET /users/members
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetAllMembersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetUserRequestsQuery,
  useGetUserReviewsQuery,
  useGetUserProfileQuery,
} = userApi;
