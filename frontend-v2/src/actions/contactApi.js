import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../frontend-v2/src/context/config";
export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // Adjust base URL as needed
  tagTypes: ["Contact"], // For cache invalidation
  endpoints: (builder) => ({
    createContact: builder.mutation({
      query: (contactData) => ({
        url: "/contacts",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["Contact"],
    }),
    getAllContacts: builder.query({
      query: () => "/contacts",
      providesTags: ["Contact"],
    }),
    getContactById: builder.query({
      query: (id) => `/contacts/${id}`,
      providesTags: ["Contact"],
    }),
    updateContact: builder.mutation({
      query: ({ id, ...contactData }) => ({
        url: `/contacts/${id}`,
        method: "PUT",
        body: contactData,
      }),
      invalidatesTags: ["Contact"],
    }),
    searchContactByEmail: builder.query({
      query: (email) => `/contacts/search?email=${email}`,
      providesTags: ["Contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useSearchContactByEmailQuery,
  useDeleteContactMutation,
} = contactApi;
