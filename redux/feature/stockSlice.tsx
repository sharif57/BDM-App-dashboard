"use client";

import baseApi from "../Api/baseApi";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    allStockProducts: builder.query({
      query: () => ({
        url: "/products/products/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    createStock: builder.mutation({
      query: (stockData) => ({
        url: "/products/batch/add/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: stockData,
      }),
      invalidatesTags: ["User"],
    }),

    stockData: builder.query({
        query: (id) => ({
            url: `/products/batch/${id}/summary/`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }),
        providesTags: ["Stock"],
    }),

    confirmStock: builder.mutation({
        query: (id) => ({
            url: `/products/batch/${id}/confirm/`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }),
        invalidatesTags: ["Stock"],
    }),

    cancelStock: builder.mutation({
        query: (id) => ({
            url: `/products/batch/${id}/cancel/`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }),
        invalidatesTags: ["Stock"],
    }),
// /products/products/search/?q=napa
    searchProduct: builder.query({
        query: (query) => ({
            url: `/products/products/search/?q=${query}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }),
        providesTags: ["User"],
    }),

    batchIdSearch: builder.query({
        query: (id) => ({
            url: `/products/batch/${id}/get_summary/`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }),
        providesTags: ["Stock"],
    }),


  }),
});

export const { useAllStockProductsQuery , useCreateStockMutation , useStockDataQuery , useConfirmStockMutation , useCancelStockMutation , useSearchProductQuery , useBatchIdSearchQuery } = stockApi;
