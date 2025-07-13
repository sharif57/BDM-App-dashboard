import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.10.33:8001/api",
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem("accessToken");

    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: [
    "User",
    "Session",
    "Story",
    "Blog",

  ],
  endpoints: () => ({}),
});

export default baseApi;
