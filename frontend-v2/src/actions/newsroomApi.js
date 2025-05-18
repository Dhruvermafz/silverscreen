import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";
export const newsroomApi = createApi({
  reducerPath: "newsroomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/newsrooms`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Newsrooms", "Newsroom", "NewsroomPosts"],
  endpoints: (builder) => ({
    // Create Newsroom
    createNewsroom: builder.mutation({
      query: (newsroomData) => ({
        url: "/",
        method: "POST",
        body: newsroomData,
      }),
      invalidatesTags: ["Newsrooms"],
    }),

    // Update Newsroom
    updateNewsroom: builder.mutation({
      query: ({ newsroomId, ...updates }) => ({
        url: `/${newsroomId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { newsroomId }) => [
        { type: "Newsroom", id: newsroomId },
      ],
    }),

    // Get Newsroom by ID
    getNewsroomById: builder.query({
      query: (newsroomId) => `/${newsroomId}`,
      providesTags: (result, error, newsroomId) => [
        { type: "Newsroom", id: newsroomId },
      ],
    }),

    // Add Newsroom Moderator
    addNewsroomModerator: builder.mutation({
      query: ({ newsroomId, userId }) => ({
        url: `/${newsroomId}/moderator/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { newsroomId }) => [
        { type: "Newsroom", id: newsroomId },
      ],
    }),

    // Post News to Newsroom
    postNewsToNewsroom: builder.mutation({
      query: ({ newsroomId, postData }) => ({
        url: `/${newsroomId}/posts`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: (result, error, { newsroomId }) => [
        { type: "NewsroomPosts", id: newsroomId },
      ],
    }),

    // Edit News Post
    editNewsPost: builder.mutation({
      query: ({ postId, ...updates }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "NewsroomPosts" },
      ],
    }),

    // Delete News Post
    deleteNewsPost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NewsroomPosts"],
    }),

    // Comment on News Post
    commentOnNewsPost: builder.mutation({
      query: ({ postId, commentData }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "NewsroomPosts" },
      ],
    }),

    // Get All Newsrooms
    getAllNewsrooms: builder.query({
      query: () => "/",
      providesTags: ["Newsrooms"],
    }),

    // Get All News Posts
    getAllNewsPosts: builder.query({
      query: (newsroomId) => `/${newsroomId}/posts`,
      providesTags: (result, error, newsroomId) => [
        { type: "NewsroomPosts", id: newsroomId },
      ],
    }),
  }),
});

export const {
  useCreateNewsroomMutation,
  useUpdateNewsroomMutation,
  useGetNewsroomByIdQuery,
  useAddNewsroomModeratorMutation,
  usePostNewsToNewsroomMutation,
  useEditNewsPostMutation,
  useDeleteNewsPostMutation,
  useCommentOnNewsPostMutation,
  useGetAllNewsroomsQuery,
  useGetAllNewsPostsQuery,
} = newsroomApi;
