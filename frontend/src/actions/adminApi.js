import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/admin`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["DashboardStats"],
    }),
    getTopItems: builder.query({
      query: ({ page, pageSize }) =>
        `/films/top?page=${page}&pageSize=${pageSize}`,
      providesTags: ["TopItems"],
    }),
    getLatestItems: builder.query({
      query: ({ page, pageSize }) =>
        `/films/latest?page=${page}&pageSize=${pageSize}`,
      providesTags: ["LatestItems"],
    }),
    getLatestUsers: builder.query({
      query: ({ page, pageSize }) =>
        `/users/latest?page=${page}&pageSize=${pageSize}`,
      providesTags: ["LatestUsers"],
    }),
    getLatestReviews: builder.query({
      query: ({ page, pageSize }) =>
        `/reviews/latest?page=${page}&pageSize=${pageSize}`,
      providesTags: ["LatestReviews"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTopItemsQuery,
  useGetLatestItemsQuery,
  useGetLatestUsersQuery,
  useGetLatestReviewsQuery,
} = adminApi;
