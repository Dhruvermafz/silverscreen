// src/features/api/movieApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/movies" }), // Adjust this base URL as needed
  tagTypes: ["Movies", "Requests"],
  endpoints: (builder) => ({
    // GET all movies
    getMovies: builder.query({
      query: () => "/",
      providesTags: ["Movies"],
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
  }),
});

export const {
  useGetMoviesQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useSubmitMovieRequestMutation,
  useDeleteMovieRequestMutation,
} = movieApi;
