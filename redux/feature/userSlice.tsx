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

 




  }),
});

export const { useUserProfileQuery, useUpdateProfileMutation, useAllUsersQuery, useSettingDataQuery, useUpdateSettingMutation } = userApi;
