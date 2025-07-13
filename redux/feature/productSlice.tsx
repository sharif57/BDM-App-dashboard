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

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/update_user_profile/",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useAllProductsQuery, useUpdateProfileMutation } = productsApi;
