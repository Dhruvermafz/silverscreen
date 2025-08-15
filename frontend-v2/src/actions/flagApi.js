import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const flagApi = createApi({
  reducerPath: "flagApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    submitFlag: builder.mutation({
      query: (flagData) => ({
        url: "/flags",
        method: "POST",
        body: flagData,
      }),
    }),
    getUserFlags: builder.query({
      query: (userId) => `/flags/${userId}`,
    }),
    reviewFlag: builder.mutation({
      query: ({ flagId, status, adminResponse }) => ({
        url: `/flags/${flagId}/review`,
        method: "PUT",
        body: { status, adminResponse },
      }),
    }),
  }),
});

export const {
  useSubmitFlagMutation,
  useGetUserFlagsQuery,
  useReviewFlagMutation,
} = flagApi;
