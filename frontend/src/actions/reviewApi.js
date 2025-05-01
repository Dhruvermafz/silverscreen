import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: { API_URL },
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Adjust to match your Express server's URL
  endpoints: (builder) => ({
    // Add a review
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData, // Send the review data to be added
      }),
    }),

    // Get reviews for a specific movie
    getReviews: builder.query({
      query: (movieId) => `/reviews/${movieId}`, // GET /reviews/:movieId
    }),

    // Delete a review by ID
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`, // DELETE /reviews/:reviewId
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
} = reviewApi;
