import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";

export const listApi = createApi({
  reducerPath: "listApi",
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
    getLists: builder.query({
      query: () => "/lists",
    }),
    getListsByUserId: builder.query({
      query: (userId) => `/lists/user/${userId}`,
    }),
    createList: builder.mutation({
      query: ({ name, isPrivate }) => ({
        url: "/lists",
        method: "POST",
        body: { name, isPrivate },
      }),
    }),
    deleteList: builder.mutation({
      query: (id) => ({
        url: `/lists/${id}`,
        method: "DELETE",
      }),
    }),
    addMovieToList: builder.mutation({
      query: ({ listId, movie }) => ({
        url: `/lists/${listId}/movies`,
        method: "POST",
        body: { movie },
      }),
    }),
    updateList: builder.mutation({
      query: ({ listId, name, isPrivate }) => ({
        url: `/lists/${listId}`,
        method: "PUT",
        body: { name, isPrivate },
      }),
    }),
    removeMovieFromList: builder.mutation({
      query: ({ listId, movieId }) => ({
        url: `/lists/${listId}/movies/${movieId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetListsByUserIdQuery,
  useCreateListMutation,
  useDeleteListMutation,
  useAddMovieToListMutation,
  useUpdateListMutation,
  useRemoveMovieFromListMutation,
} = listApi;
