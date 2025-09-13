"use client";

import baseApi from "../Api/baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allOrders: builder.query({
            query: ({ from_datetime, to_datetime, area }) => ({
                url: `/orders/orders/`,
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

        // /orders/orders/48/
        updateOrders: builder.mutation({
            query: ({ id, data }) => ({
                url: `/orders/orders/${id}/`,
                method: "PATCH",
                body: data,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),
            invalidatesTags: ["Order"],
        }),

        // /orders/orders/filter/?from_datetime=2025-09-01T00:00:00&to_datetime=2025-09-10T23:59:59&area=1
        filterOrders: builder.query({
            query: ({ from_datetime, to_datetime, area , limit, page }) => ({
                url: `/orders/orders/?from_datetime=${from_datetime}&to_datetime=${to_datetime}&area=${area}&limit=${limit}&page=${page}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),
            providesTags: ["Order"],    
        }),

    }),
});

export const { useAllOrdersQuery, useDeleteOrderMutation , usePendingProductsQuery, useUpdateOrdersMutation , useFilterOrdersQuery } = orderApi;
