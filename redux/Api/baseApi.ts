import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.bdmpharmacy.store",
    baseUrl: "https://api.bdmpharmacy.store",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Session", "Area", "Blog", "Product",'Order','Category', 'Notice', 'Notification', 'Banner' , 'Stock'],
  endpoints: () => ({}),
});

export default baseApi;
