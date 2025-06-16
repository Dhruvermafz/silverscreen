import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
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
    // Add a review
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: {
          ...reviewData,
          movie: reviewData.movieId,
          comment: reviewData.comment || reviewData.content,
        }, // Map movieId to movie, content to comment
      }),
    }),

    // Get reviews for a specific movie
    getReviews: builder.query({
      query: (movieId) => `/reviews/${movieId}`,
      transformResponse: (response) =>
        response.map((review) => ({
          ...review,
          id: review._id, // Map _id to id
          content: review.comment, // Map comment to content
          author: review.user?.username || "Anonymous", // Map user.username to author
        })),
    }),

    // Delete a review by ID
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
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
