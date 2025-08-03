import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bugReportApi = createApi({
  reducerPath: "bugReportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
  }),
  endpoints: (builder) => ({
    createBugReport: builder.mutation({
      query: ({ description, pageUrl, screenshot }) => {
        const formData = new FormData();
        formData.append("description", description);
        formData.append("pageUrl", pageUrl);
        if (screenshot) {
          formData.append("screenshot", screenshot);
        }
        return {
          url: "/bug-report",
          method: "POST",
          body: formData,
          headers: {
            // RTK Query automatically sets Content-Type for FormData
          },
        };
      },
    }),
  }),
});

export const { useCreateBugReportMutation } = bugReportApi;
