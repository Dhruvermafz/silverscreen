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
        },
      }),
    }),
    // Get reviews (modified to support admin fetching all reviews)
    getReviews: builder.query({
      query: ({ movieId, search, sort, page, limit }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (sort) params.append("sort", sort);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        return movieId === "all"
          ? `/reviews?${params.toString()}`
          : `/reviews/${movieId}`;
      },
      transformResponse: (response) =>
        response.reviews
          ? {
              reviews: response.reviews.map((review) => ({
                ...review,
                id: review._id,
                content: review.comment,
                author: review.user?.username || "Anonymous",
                movieTitle: review.movieTitle || "Unknown", // Assume backend populates movieTitle
              })),
              total: response.total,
            }
          : response.map((review) => ({
              ...review,
              id: review._id,
              content: review.comment,
              author: review.user?.username || "Anonymous",
              movieTitle: review.movieTitle || "Unknown",
            })),
    }),
    // Delete a review by ID
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
    }),
    // Toggle review status
    toggleReviewStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reviews/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useAddReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useToggleReviewStatusMutation,
} = reviewApi;
