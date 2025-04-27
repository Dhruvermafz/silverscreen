import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }), // Adjust to match your Express server's URL
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
