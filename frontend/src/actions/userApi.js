import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Users", "Reviews", "Requests"],
  endpoints: (builder) => ({
    // User Profile
    getProfile: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (updatedData) => ({
        url: "/users",
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["User"],
    }),

    // User Management
    getAllUsers: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        search = "",
        sort = "createdAt",
        order = "desc",
      } = {}) =>
        `/users?page=${page}&pageSize=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Admin Actions
    addUser: builder.mutation({
      query: (body) => ({
        url: "/admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Users", "User"],
    }),

    // Social Features
    followUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Users"],
    }),
    unfollowUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/unfollow`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Users"],
    }),

    // User Activity
    getUserReviews: builder.query({
      query: (userId) => `/users/${userId}/reviews`,
      providesTags: ["Reviews"],
    }),
    getUserRequests: builder.query({
      query: (userId) => `/users/${userId}/requests`,
      providesTags: ["Requests"],
    }),

    // User Settings
    updatePreferences: builder.mutation({
      query: ({ id, preferences }) => ({
        url: `/users/${id}/preferences`,
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["User"],
    }),
    updateRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User", "Users"],
    }),
    completeOnboarding: builder.mutation({
      query: ({ id, isNewUser }) => ({
        url: `/users/${id}/onboarding`,
        method: "PUT",
        body: { isNewUser },
      }),
      invalidatesTags: ["User", "Users"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useAddUserMutation,
  useUpdateUserStatusMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetUserReviewsQuery,
  useGetUserRequestsQuery,
  useUpdatePreferencesMutation,
  useUpdateRoleMutation,
  useCompleteOnboardingMutation,
} = userApi;
