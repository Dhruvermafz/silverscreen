import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listApi = createApi({
  reducerPath: "listApi", // Defines the name for the slice in the Redux store
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }), // Change this to your Express API base URL
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
  }),
});

export const {
  useGetListsQuery,
  useCreateListMutation,
  useDeleteListMutation,
} = listApi;
