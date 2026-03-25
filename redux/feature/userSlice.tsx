"use client";

import { info } from "console";
import baseApi from "../Api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: "/auth/user_profile/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/user_profile/",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/user/${id}/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["User"],
    }),

    allUsers: builder.query({
      query: () => ({
        url: "/auth/user/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    settingData: builder.query({
      query: () => ({
        url: "/settings/site_info/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    updateSetting: builder.mutation({
      query: (data) => ({
        url: "/settings/site_info/",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    updateUsers: builder.mutation({
      query: ({data , id}) => ({
        url: `/auth/user/${id}/`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["User"],
    }),

    // /settings/privacy-policy/
    privacyPolicy: builder.query({
      query: () => ({
        url: "/settings/privacy-policy/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    updatePrivacyPolicy: builder.mutation({
      query: ({data, id}) => ({
        url: `/settings/privacy-policy-detail/${id}/`,
        method: "PATCH",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
    }),

    // /settings/conditional-discounts/
    conditionalDiscounts: builder.query({
      query: () => ({
        url: "/settings/conditional-discounts/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["User"],
    }),

    // /settings/conditional-discounts-details/
    updateConditionalDiscounts: builder.mutation({
      query: (data) => ({
        url: `/settings/conditional-discounts-details/`,
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

export const { useUserProfileQuery, useUpdateProfileMutation, useAllUsersQuery, useSettingDataQuery, useUpdateSettingMutation , useDeleteUserMutation, useUpdateUsersMutation , usePrivacyPolicyQuery , useUpdatePrivacyPolicyMutation , useConditionalDiscountsQuery , useUpdateConditionalDiscountsMutation } = userApi;
