"use client";

import baseApi from "../Api/baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allOrders: builder.query({
            query: () => ({
                url: "/orders/orders/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),

            providesTags: ["Order"],
        }),

        pendingProducts: builder.query({
            query: () => ({
                url: "/orders/pending_order/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),
            providesTags: ["Order"],
        }),

        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/orders/${id}/`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),
            invalidatesTags: ["Order"],
        }),

    }),
});

export const { useAllOrdersQuery, useDeleteOrderMutation , usePendingProductsQuery } = orderApi;
