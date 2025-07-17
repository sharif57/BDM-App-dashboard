"use client";

import baseApi from "../Api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCategories: builder.query({
            query: () => ({
                url: "/products/categories/",
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

export const { useAllCategoriesQuery, useAddPostMutation, useDeleteCategoryMutation } = categoriesApi;
