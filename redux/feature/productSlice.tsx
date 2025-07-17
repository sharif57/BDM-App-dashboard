"use client";

import baseApi from "../Api/baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allProducts: builder.query({
      query: () => ({
        url: "/products/products/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),

    addPost: builder.mutation({
      query: (data) => ({
        url: "/products/products/",
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useAllProductsQuery, useAddPostMutation } = productsApi;
