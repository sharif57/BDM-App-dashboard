"use client";

import baseApi from "../Api/baseApi";

export const genericApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    allGenerics: builder.query({
      query: () => ({
        url: "/products/generic_name/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["User"],
    }),

    
  }),
});

export const { useAllGenericsQuery } = genericApi;
