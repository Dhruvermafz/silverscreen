// src/features/api/movieApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/movies`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Adjust this base URL as needed
  tagTypes: ["Movies", "Requests"],
  endpoints: (builder) => ({
    // GET all movies
    getMovies: builder.query({
      query: () => "/",
      providesTags: ["Movies"],
    }),
    submitMovieRequest: builder.mutation({
      query: (data) => ({
        url: "/movie/request",
        method: "POST",
        body: data,
      }),
    }),
    // POST new movie
    addMovie: builder.mutation({
      query: (newMovie) => ({
        url: "/",
        method: "POST",
        body: newMovie,
      }),
      invalidatesTags: ["Movies"],
    }),

    // PUT update movie
    updateMovie: builder.mutation({
      query: ({ id, updatedMovie }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedMovie,
      }),
      invalidatesTags: ["Movies"],
    }),

    // DELETE movie
    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movies"],
    }),

    // POST movie request
    submitMovieRequest: builder.mutation({
      query: (requestData) => ({
        url: "/requests",
        method: "POST",
        body: requestData,
      }),
      invalidatesTags: ["Requests"],
    }),

    // DELETE movie request
    deleteMovieRequest: builder.mutation({
      query: (id) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Requests"],
    }),

    suggestMovie: builder.mutation({
      query: ({ receiverId, tmdbId, message }) => ({
        url: `/suggest/${receiverId}`,
        method: "POST",
        body: { tmdbId, message },
      }),
    }),

    // Get all movie suggestions for the current user
    getSuggestions: builder.query({
      query: () => "/suggestions",
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useSubmitMovieRequestMutation,
  useDeleteMovieRequestMutation,
  useSuggestMovieMutation,
  useGetSuggestionsQuery,
} = movieApi;
