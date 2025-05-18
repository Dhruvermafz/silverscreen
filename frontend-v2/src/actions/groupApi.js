import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../context/config";
export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/groups`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Groups", "Group", "GroupPosts"],
  endpoints: (builder) => ({
    // Create Group
    createGroup: builder.mutation({
      query: (groupData) => ({
        url: "/",
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Groups"],
    }),

    // Update Group Details
    updateGroupDetails: builder.mutation({
      query: ({ groupId, ...updates }) => ({
        url: `/${groupId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Delete Group
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: `/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),

    // Join Group
    joinGroup: builder.mutation({
      query: (groupId) => ({
        url: `/${groupId}/join`,
        method: "POST",
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Leave Group
    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/${groupId}/leave`,
        method: "POST",
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Get Group by ID
    getGroupById: builder.query({
      query: (groupId) => `/${groupId}`,
      providesTags: (result, error, groupId) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Get Group Posts
    getGroupPosts: builder.query({
      query: (groupId) => `/${groupId}/posts`,
      providesTags: (result, error, groupId) => [
        { type: "GroupPosts", id: groupId },
      ],
    }),

    // Post to Group
    postToGroup: builder.mutation({
      query: ({ groupId, postData }) => ({
        url: `/${groupId}/posts`,
        method: "POST",
        body: postData,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "GroupPosts", id: groupId },
      ],
    }),

    // Comment on Group Post
    commentOnGroupPost: builder.mutation({
      query: ({ postId, commentData }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "GroupPosts" }],
    }),

    // Promote to Moderator
    promoteToModerator: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `/${groupId}/moderator/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Ban User from Group
    banUserFromGroup: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `/${groupId}/ban/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Group", id: groupId },
      ],
    }),

    // Get All Groups
    getAllGroups: builder.query({
      query: () => "/",
      providesTags: ["Groups"],
    }),

    // Search Groups
    searchGroups: builder.query({
      query: (query) => `/search?query=${encodeURIComponent(query)}`,
      providesTags: ["Groups"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useUpdateGroupDetailsMutation,
  useDeleteGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetGroupByIdQuery,
  useGetGroupPostsQuery,
  usePostToGroupMutation,
  useCommentOnGroupPostMutation,
  usePromoteToModeratorMutation,
  useBanUserFromGroupMutation,
  useGetAllGroupsQuery,
  useSearchGroupsQuery,
} = groupApi;
