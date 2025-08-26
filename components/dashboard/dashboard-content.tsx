// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import SalesChart from "@/components/charts/sales-chart";
// import RevenueChart from "@/components/charts/revenue-chart";
// import MostSellingChart from "@/components/charts/most-selling-chart";
// import NotificationsPanel from "../layout/notifications-panel";
// import { useAllProductsQuery } from "@/redux/feature/productSlice";
// import { useAllUsersQuery } from "@/redux/feature/userSlice";
// import { usePendingProductsQuery } from "@/redux/feature/orderSlice";
// import { useAllDashboardQuery } from "@/redux/feature/dashboardSlice";





// export default function DashboardContent() {
//   const { data } = useAllProductsQuery(undefined);
//   const { data: userData } = useAllUsersQuery(undefined); 
//   const { data: productData } = usePendingProductsQuery(undefined);

//   const {data: dashboard, isLoading, isError} =useAllDashboardQuery(undefined)
//   console.log("dashboard",dashboard?.data)

//   const statsCards = [
//     { title: "Total Users", value: userData?.count, icon: "👥" },
//     { title: "Total Product", value: data?.count, icon: "📦" },
//     { title: "Total Sell", value: dashboard?.data?.total_sales || 0, icon: "💰" },
//     { title: "Total Revenue", value: dashboard?.data?.monthly_revenue[0]?.total_revenue || 0, icon: "💵" },
//     { title: "Pending Order", value: productData?.total || 0, icon: "⏳" },
//   ];

//   const [selectedPeriod, setSelectedPeriod] = useState("Jan - Jun '22");


//   // Calculate total quantity sold for percentage calculation
//   const totalSold = dashboard.data.top_selling_product.reduce(
//     (sum, item) => sum + item.total_quantity_sold,
//     0
//   );

//   // Map top_selling_product to mostSoldItems with percentage and color
//   const mostSoldItems = dashboard.data.top_selling_product.map((item, index) => {
//     const colors = [
//       "bg-blue-500",
//       "bg-green-500",
//       "bg-red-500",
//       "bg-yellow-500",
//       "bg-purple-500",
//     ];
//     return {
//       name: item.product_name,
//       percentage: totalSold > 0 ? ((item.total_quantity_sold / totalSold) * 100).toFixed(1) : 0,
//       color: colors[index % colors.length], // Cycle through colors
//     };
//   });

//   return (
//     <div className="p-3 sm:p-4 lg:p-6 flex  gap-4">
//       <div>
//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
//           {statsCards.map((card, index) => (
//             <Card key={card.title} className="bg-gray-800 border-gray-700">
//               <CardContent className="p-3 sm:p-4 flex items-center gap-2">
//                 <div className="flex items-center justify-between mb-2">
//                   <div
//                     className={`  rounded-lg flex items-center justify-center ${index === 4 ? "bg-red-500/20" : "bg-orange-500/20"
//                       }`}
//                   >
//                     <svg
//                       width="60"
//                       height="60"
//                       viewBox="0 0 60 60"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <rect width="60" height="60" rx="20" fill="#49494A" />
//                       <path
//                         d="M44.4394 21.8052V38.1954L30 46.0003L15.5605 38.1954V21.8052L16.3801 21.3643L30 28.7242L43.6199 21.3643L44.4394 21.8052Z"
//                         fill="#FFB655"
//                       />
//                       <path
//                         d="M30 29.6093V45.9995L15.5605 38.1946V21.8044L30 29.6093Z"
//                         fill="#FCCC97"
//                       />
//                       <path
//                         d="M22.2235 39.0811C22.1589 39.0811 22.0953 39.065 22.0385 39.0343L16.9359 36.2764C16.8448 36.2272 16.777 36.1437 16.7475 36.0445C16.7179 35.9453 16.729 35.8383 16.7782 35.7473C16.8275 35.6562 16.9109 35.5884 17.0102 35.5588C17.1094 35.5293 17.2163 35.5403 17.3074 35.5896L22.4096 38.3475C22.4861 38.3887 22.5466 38.4544 22.5816 38.534C22.6165 38.6136 22.6239 38.7026 22.6025 38.7868C22.5811 38.8711 22.5322 38.9458 22.4636 38.9991C22.3949 39.0524 22.3104 39.0813 22.2235 39.0811ZM18.9726 38.655C18.908 38.655 18.8445 38.6389 18.7876 38.6081L16.9359 37.6076C16.8908 37.5832 16.8509 37.5501 16.8186 37.5103C16.7863 37.4705 16.7621 37.4248 16.7475 37.3756C16.7328 37.3265 16.728 37.2749 16.7333 37.2239C16.7386 37.1729 16.7538 37.1235 16.7782 37.0784C16.8026 37.0333 16.8357 36.9934 16.8755 36.9611C16.9152 36.9288 16.961 36.9046 17.0102 36.89C17.0593 36.8753 17.1108 36.8705 17.1618 36.8758C17.2128 36.8811 17.2623 36.8963 17.3074 36.9207L19.1588 37.9213C19.2353 37.9626 19.2958 38.0282 19.3307 38.1078C19.3657 38.1873 19.3731 38.2763 19.3517 38.3605C19.3304 38.4447 19.2816 38.5195 19.213 38.5728C19.1444 38.6261 19.0599 38.6551 18.973 38.655H18.9726ZM20.5052 24.4771V31.1818C20.5051 31.2438 20.5199 31.3049 20.5481 31.3601C20.5764 31.4152 20.6174 31.4629 20.6678 31.499C20.7181 31.5352 20.7764 31.5588 20.8377 31.568C20.899 31.5772 20.9616 31.5716 21.0203 31.5518L22.6293 31.0093L24.3464 33.4437C24.3942 33.5113 24.4623 33.5621 24.5408 33.5885C24.6193 33.6149 24.7042 33.6157 24.7832 33.5906C24.8622 33.5656 24.9312 33.5161 24.9801 33.4492C25.0291 33.3824 25.0555 33.3017 25.0555 33.2189V26.9364L20.5052 24.4771Z"
//                         fill="#FFB655"
//                       />
//                       <path
//                         d="M15.5605 21.8044L30 29.6092L44.4394 21.8044L30 13.9995L15.5605 21.8044Z"
//                         fill="#FC9F30"
//                       />
//                       <path
//                         d="M20.4847 24.4665L25.0757 26.948L39.5152 19.1436L34.9242 16.6616L20.4847 24.4665Z"
//                         fill="#DB811F"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="flex flex-col">
//                   <div className="text-xs sm:text-sm text-gray-400 mb-1">
//                     {card.title}
//                   </div>
//                   <div
//                     className={`text-lg sm:text-2xl font-bold ${index === 4 ? "text-red-400" : "text-white"
//                       }`}
//                   >
//                     {card.value}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
//           {/* Sales Analytics */}
//           <div className="xl:col-span-2">
//             <Card className="bg-[#23252b] border-gray-700">
//               <CardHeader className="pb-2 sm:pb-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                   <CardTitle className="text-white text-lg">
//                     Sales Analytics
//                   </CardTitle>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <SalesChart />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Most Selling */}
//          <Card className="bg-[#23252b] border-gray-700">
//       <CardHeader className="pb-2 sm:pb-4">
//         <CardTitle className="text-white text-lg">Most Sold Items</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-3 sm:space-y-4">
//         {dashboard?.data?.top_selling_product?.map((item: any) => (
//           <div key={item?.product_name} className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-300">{item.name}</span>
//               <span className="text-white">{item.total_quantity_sold}%</span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-2">
//               <div
//                 className={`h-2 rounded-full ${item.color}`}
//                 style={{ width: `${item.percentage}%` }}
//               />
//             </div>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           {/* Total Revenue */}
//           <Card className="bg-[#23252b] border-gray-700">
//             <CardHeader className="pb-2 sm:pb-4">
//               <CardTitle className="text-white text-lg">
//                 Total Revenue
//               </CardTitle>
//               <div className="text-2xl sm:text-3xl font-bold text-white">
//                 {dashboard?.data?.monthly_revenue[0]?.total_revenue || 0} BDT
//               </div>
//             </CardHeader>
//             <CardContent>
//               <RevenueChart />
//             </CardContent>
//           </Card>

//           {/* Most Sold Items */}
//           <Card className="bg-[#23252b] border-gray-700">
//             <CardHeader className="pb-2 sm:pb-4">
//               <CardTitle className="text-white text-lg">
//                 {/* Most Sold Items */}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 sm:space-y-4">
//         {dashboard?.data?.top_selling_product?.map((item) => (
//                 <div key={item.name} className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-300">{item.name}</span>
//                     <span className="text-white">{item.percentage}%</span>
//                   </div>
//                   <div className="w-full bg-gray-700 rounded-full h-2">
//                     <div
//                       className={`h-2 rounded-full ${item.color}`}
//                       style={{ width: `${item.percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       <div className="hidden xl:block w-80 border-l  border-gray-700">
//         <NotificationsPanel />
//       </div>
//     </div>
//   );
// }
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllProductsQuery } from "@/redux/feature/productSlice";
import { useAllUsersQuery } from "@/redux/feature/userSlice";
import { usePendingProductsQuery } from "@/redux/feature/orderSlice";
import { useAllDashboardQuery } from "@/redux/feature/dashboardSlice";
import SalesChart from "@/components/charts/sales-chart";
import RevenueChart from "@/components/charts/revenue-chart";
import NotificationsPanel from "../layout/notifications-panel";
import MostSellingChart from "../most-selling-chart";

export default function DashboardContent() {
  const { data } = useAllProductsQuery(undefined);
  const { data: userData } = useAllUsersQuery(undefined);
  const { data: productData } = usePendingProductsQuery(undefined);
  const { data: dashboard, isLoading, isError } = useAllDashboardQuery(undefined);
  console.log(dashboard,'dashboard')

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError || !dashboard?.data) return <div>Error loading data</div>;

  const statsCards = [
    { title: "Total Users", value: dashboard?.data?.total_customers || 0, icon: "👥" },
    { title: "Total Product", value: dashboard?.data?.total_products || 0, icon: "📦" },
    { title: "Total Sell", value: dashboard?.data?.total_sales || 0, icon: "💰" },
    {
      title: "Total Revenue",
      value: dashboard?.data?.monthly_revenue[0]?.total_revenue || 0,
      icon: "💵",
    },
    { title: "Pending Order", value: dashboard?.data?.total_pending_orders || 0, icon: "⏳" },
  ];

  // Calculate total quantity sold for percentage calculation
  const totalSold = dashboard.data.top_selling_product.reduce(
    (sum, item) => sum + item.total_quantity_sold,
    0
  );

  // Map top_selling_product to mostSoldItems with percentage and color
  const mostSoldItems = dashboard.data.top_selling_product.map((item, index) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-purple-500",
    ];
    return {
      name: item.product_name,
      percentage: totalSold > 0 ? ((item.total_quantity_sold / totalSold) * 100).toFixed(1) : 0,
      color: colors[index % colors.length], // Cycle through colors
    };
  });

  return (
    <div className="p-3 sm:p-4 lg:p-6 flex gap-4">
      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {statsCards.map((card, index) => (
            <Card key={card.title} className="bg-gray-800 border-gray-700">
              <CardContent className="p-3 sm:p-4 flex items-center gap-2">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`rounded-lg flex items-center justify-center ${
                      index === 4 ? "bg-red-500/20" : "bg-orange-500/20"
                    }`}
                  >
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="60" height="60" rx="20" fill="#49494A" />
                      <path
                        d="M44.4394 21.8052V38.1954L30 46.0003L15.5605 38.1954V21.8052L16.3801 21.3643L30 28.7242L43.6199 21.3643L44.4394 21.8052Z"
                        fill="#FFB655"
                      />
                      <path
                        d="M30 29.6093V45.9995L15.5605 38.1946V21.8044L30 29.6093Z"
                        fill="#FCCC97"
                      />
                      <path
                        d="M22.2235 39.0811C22.1589 39.0811 22.0953 39.065 22.0385 39.0343L16.9359 36.2764C16.8448 36.2272 16.777 36.1437 16.7475 36.0445C16.7179 35.9453 16.729 35.8383 16.7782 35.7473C16.8275 35.6562 16.9109 35.5884 17.0102 35.5588C17.1094 35.5293 17.2163 35.5403 17.3074 35.5896L22.4096 38.3475C22.4861 38.3887 22.5466 38.4544 22.5816 38.534C22.6165 38.6136 22.6239 38.7026 22.6025 38.7868C22.5811 38.8711 22.5322 38.9458 22.4636 38.9991C22.3949 39.0524 22.3104 39.0813 22.2235 39.0811ZM18.9726 38.655C18.908 38.655 18.8445 38.6389 18.7876 38.6081L16.9359 37.6076C16.8908 37.5832 16.8509 37.5501 16.8186 37.5103C16.7863 37.4705 16.7621 37.4248 16.7475 37.3756C16.7328 37.3265 16.728 37.2749 16.7333 37.2239C16.7386 37.1729 16.7538 37.1235 16.7782 37.0784C16.8026 37.0333 16.8357 36.9934 16.8755 36.9611C16.9152 36.9288 16.961 36.9046 17.0102 36.89C17.0593 36.8753 17.1108 36.8705 17.1618 36.8758C17.2128 36.8811 17.2623 36.8963 17.3074 36.9207L19.1588 37.9213C19.2353 37.9626 19.2958 38.0282 19.3307 38.1078C19.3657 38.1873 19.3731 38.2763 19.3517 38.3605C19.3304 38.4447 19.2816 38.5195 19.213 38.5728C19.1444 38.6261 19.0599 38.6551 18.973 38.655H18.9726ZM20.5052 24.4771V31.1818C20.5051 31.2438 20.5199 31.3049 20.5481 31.3601C20.5764 31.4152 20.6174 31.4629 20.6678 31.499C20.7181 31.5352 20.7764 31.5588 20.8377 31.568C20.899 31.5772 20.9616 31.5716 21.0203 31.5518L22.6293 31.0093L24.3464 33.4437C24.3942 33.5113 24.4623 33.5621 24.5408 33.5885C24.6193 33.6149 24.7042 33.6157 24.7832 33.5906C24.8622 33.5656 24.9312 33.5161 24.9801 33.4492C25.0291 33.3824 25.0555 33.3017 25.0555 33.2189V26.9364L20.5052 24.4771Z"
                        fill="#FFB655"
                      />
                      <path
                        d="M15.5605 21.8044L30 29.6092L44.4394 21.8044L30 13.9995L15.5605 21.8044Z"
                        fill="#FC9F30"
                      />
                      <path
                        d="M20.4847 24.4665L25.0757 26.948L39.5152 19.1436L34.9242 16.6616L20.4847 24.4665Z"
                        fill="#DB811F"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">
                    {card.title}
                  </div>
                  <div
                    className={`text-lg sm:text-2xl font-bold ${
                      index === 4 ? "text-red-400" : "text-white"
                    }`}
                  >
                    {card.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Sales Analytics */}
          <div className="xl:col-span-2">
            <Card className="bg-[#23252b] border-gray-700">
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-white text-lg">
                    Sales Analytics
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
          </div>

          {/* Most Selling Chart */}
          <Card className="bg-[#23252b] border-gray-700">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-white text-lg">
                Most Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MostSellingChart />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Total Revenue */}
          <Card className="bg-[#23252b] border-gray-700">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-white text-lg">
                Total Revenue
              </CardTitle>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {dashboard?.data?.monthly_revenue[0]?.total_revenue || 0} BDT
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          {/* Most Sold Items */}
          <Card className="bg-[#23252b] border-gray-700">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-white text-lg">
                Most Sold Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {mostSoldItems.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden xl:block w-80 border-l border-gray-700">
        <NotificationsPanel />
      </div>
    </div>
  );
}