import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Fetch the logged-in user's profile
    getProfile: builder.query({
      query: () => "/users/profile",
    }),
    updatePreferences: builder.mutation({
      query: ({ userId, preferences }) => ({
        url: `/users/${userId}/preferences`,
        method: "PUT",
        body: preferences,
      }),
    }),
    updateRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: "PUT",
        body: { role },
      }),
    }),
    // Update the logged-in user's profile
    updateProfile: builder.mutation({
      query: (updatedData) => ({
        url: "/users/profile",
        method: "PUT",
        body: updatedData,
      }),
    }),
    // Fetch all users
    getAllUsers: builder.query({
      query: () => "/users",
    }),
    // Fetch a user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
    }),
    // Delete a user by ID
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
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
    // Fetch all members
    getAllMembers: builder.query({
      query: () => "/users/",
    }),
    // Complete onboarding
    completeOnboarding: builder.mutation({
      query: ({ userId, isNewUser }) => ({
        url: `/users/${userId}/onboarding`,
        method: "PUT",
        body: { isNewUser },
      }),
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
  useUpdatePreferencesMutation,
  useUpdateRoleMutation,
  useCompleteOnboardingMutation, // Export new hook
} = userApi;
