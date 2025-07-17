"use client";

import baseApi from "../Api/baseApi";

export const companiesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCompanies: builder.query({
            query: () => ({
                url: "/products/companies/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),

            providesTags: ["Category"],
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
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation({
            query: ({ id }) => ({
                url: `/products/categories/${id}/`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }),
        }),

    }),
});

export const { useAllCompaniesQuery, useAddPostMutation, useDeleteCategoryMutation } = companiesApi;
