"use client";

import baseApi from "../Api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    allDashboard: builder.query({
      query: () => ({
        url: "/dashboard/dashboard_info/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["User"],
    }),

    
  }),
});

export const { useAllDashboardQuery } = dashboardApi;
