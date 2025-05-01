import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listApi = createApi({
  reducerPath: "listApi", // Defines the name for the slice in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: "https://silverscreen.onrender.com/api",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }), // Change this to your Express API base URL
  endpoints: (builder) => ({
    // Fetch lists
    getLists: builder.query({
      query: () => "/lists", // Maps to GET /lists
    }),
    // Create a new list
    createList: builder.mutation({
      query: (newList) => ({
        url: "/lists", // Maps to POST /lists
        method: "POST",
        body: newList, // Send the data as the request body
      }),
    }),
    // Delete a list by ID
    deleteList: builder.mutation({
      query: (id) => ({
        url: `/lists/${id}`, // Maps to DELETE /lists/:id
        method: "DELETE",
      }),
    }),
    addMovieToList: builder.mutation({
      query: ({ listId, movie }) => ({
        url: `/lists/${listId}/add`,
        method: "POST",
        body: { movie },
      }),
    }),
  }),
});

export const {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useAddMovieToListMutation,
} = listApi;
