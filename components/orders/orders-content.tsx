
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Calendar,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Info,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   useAllOrdersQuery,
//   useDeleteOrderMutation,
//   usePendingProductsQuery,
// } from "@/redux/feature/orderSlice";
// import { toast } from "sonner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// interface Order {
//   id: string;
//   date: string;
//   customerName: string;
//   shopName: string;
//   amount: string;
//   status: "pending" | "delivered" | "shipped";
//   shippingAddress?: string;
//   items?: Array<{
//     product: number;
//     product_name: string;
//     quantity: number;
//     mrp: string;
//     discount_percent: string;
//     discount: number;
//     items_total: number;
//   }>;
// }

// // Helper functions
// const formatDate = (dateString: string) =>
//   new Date(dateString).toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

// const mapApiToOrders = (apiData: any[]): Order[] =>
//   apiData.map((order) => ({
//     id: `#${order.order_id}`,
//     date: formatDate(order.order_date),
//     customerName: order.user_id ? `User-${order.user_id}` : "Unknown",
//     shopName: "MJ Pharma",
//     amount: `₹${order.final_amount.toFixed(2)}`,
//     status: order.order_status.toLowerCase() as "pending" | "delivered" | "shipped",
//     shippingAddress: order.shipping_address,
//     items: order.items,
//   }));

// const getStatusColor = (status: string) =>
// ({
//   pending: "text-red-400",
//   delivered: "text-green-400",
//   shipped: "text-blue-400",
//   default: "text-gray-400",
// }[status.toLowerCase()] || "text-gray-400");

// export default function Component() {
//   const { data: allOrdersData, isLoading, isError, refetch: refetchAllOrders } = useAllOrdersQuery(undefined);
//   console.log(allOrdersData, "data from order API");
//   const { data: pendingData, refetch: refetchPendingOrders } = usePendingProductsQuery(undefined);
//   const [deleteOrder] = useDeleteOrderMutation();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showPendingOrders, setShowPendingOrders] = useState(false);
//   const itemsPerPage = 7;
//   const totalPages = Math.ceil((orders.length || 0) / itemsPerPage);

//   const [activeTab, setActiveTab] = useState("All");



//   // Update orders based on data availability
//   useEffect(() => {
//     if (showPendingOrders && pendingData?.data) {
//       setOrders(mapApiToOrders(pendingData.data));
//     } else if (allOrdersData?.data?.results?.data) {
//       setOrders(mapApiToOrders(allOrdersData.data.results.data)); // Default to all orders
//     }
//   }, [allOrdersData, pendingData, showPendingOrders]);

//   const handleStatusChange = (orderIndex: number, newStatus: "pending" | "delivered" | "shipped") =>
//     setOrders((prev) =>
//       prev.map((order, index) =>
//         index === orderIndex ? { ...order, status: newStatus } : order
//       )
//     );

//   const handleAction = (orderIndex: number, action: "approve" | "info" | "delete") => {
//     switch (action) {
//       case "approve":
//         handleStatusChange(orderIndex, "delivered");
//         break;
//       case "info":
//         setSelectedOrder(orders[orderIndex]);
//         break;
//       case "delete":
//         const orderId = parseInt(orders[orderIndex].id.replace(/^#/, ""));
//         if (!isNaN(orderId)) handleDelete(orderId);
//         break;
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteOrder(id).unwrap();
//       toast.success("Order deleted successfully!", { position: "top-right" });
//       setOrders((prev) => prev.filter((order) => parseInt(order.id.replace(/^#/, "")) !== id));
//       refetchAllOrders();
//       refetchPendingOrders();
//     } catch {
//       toast.error("Failed to delete order!", { position: "top-right" });
//     }
//   };

//   const handleDetailsClick = () => {
//     setShowPendingOrders(true);
//     if (pendingData?.data) {
//       setOrders(mapApiToOrders(pendingData.data));
//     }
//     setCurrentPage(1); // Reset to first page when showing pending orders
//   };

//   const renderPagination = () => {
//     const pages = [
//       <Button
//         key="prev"
//         variant="ghost"
//         size="sm"
//         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//         disabled={currentPage === 1}
//         className="text-white hover:bg-gray-700"
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </Button>,
//       ...Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//         const page = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
//         return (
//           <Button
//             key={page}
//             variant={currentPage === page ? "default" : "ghost"}
//             size="sm"
//             onClick={() => setCurrentPage(page)}
//             className={
//               currentPage === page
//                 ? "bg-green-500 hover:bg-green-600 text-white"
//                 : "text-white hover:bg-gray-700"
//             }
//           >
//             {page}
//           </Button>
//         );
//       }),
//       ...(totalPages > 5 && currentPage + 2 < totalPages
//         ? [
//           <span key="ellipsis" className="text-gray-400 px-2">...</span>,
//           <Button
//             key={totalPages}
//             variant="ghost"
//             size="sm"
//             onClick={() => setCurrentPage(totalPages)}
//             className="text-white hover:bg-gray-700"
//           >
//             {totalPages}
//           </Button>,
//         ]
//         : []),
//       <Button
//         key="next"
//         variant="ghost"
//         size="sm"
//         onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//         disabled={currentPage === totalPages}
//         className="text-white hover:bg-gray-700"
//       >
//         <ChevronRight className="h-4 w-4" />
//       </Button>,
//     ];
//     return pages;
//   };

//   const paginatedOrders = orders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (isLoading) return <div className="text-white">Loading...</div>;
//   if (isError) return <div className="text-red-400">Error loading orders</div>;

//   return (
//     <div className="text-white pt-6">
//       {/* Header */}
//       <Tabs defaultValue="account" className="w-[400px]">
//         <TabsList>
//           <TabsTrigger value="account">All Orders List</TabsTrigger>
//           <TabsTrigger value="password">Pending Orders</TabsTrigger>
//         </TabsList>
//         <TabsContent value="account">Manage your account here.</TabsContent>
//         <TabsContent value="password"> Manage your password here.</TabsContent>
//       </Tabs>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold">Order Details</h1>
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <svg
//               width="26"
//               height="28"
//               viewBox="0 0 26 28"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M25.6342 6.82921V21.1707L13 27.9999L0.36586 21.1707V6.82921L1.08293 6.44336L13 12.8834L24.9171 6.44336L25.6342 6.82921Z"
//                 fill="#FFB655"
//               />
//               <path
//                 d="M13 13.6584V27.9998L0.36586 21.1706V6.8291L13 13.6584Z"
//                 fill="#FCCC97"
//               />
//               <path
//                 d="M6.19567 21.9461C6.13916 21.946 6.08354 21.9319 6.03382 21.9051L1.56918 19.492C1.48949 19.4489 1.43018 19.3758 1.40431 19.289C1.37844 19.2022 1.38813 19.1086 1.43123 19.0289C1.47434 18.9492 1.54734 18.8899 1.63418 18.8641C1.72101 18.8382 1.81456 18.8479 1.89426 18.891L6.35855 21.3041C6.42549 21.3402 6.47845 21.3977 6.50902 21.4673C6.5396 21.537 6.54605 21.6148 6.52734 21.6886C6.50864 21.7623 6.46585 21.8277 6.40576 21.8743C6.34568 21.921 6.27174 21.9462 6.19567 21.9461ZM3.35128 21.5732C3.29477 21.5732 3.23914 21.5591 3.18943 21.5322L1.56918 20.6567C1.52972 20.6353 1.49485 20.6064 1.46657 20.5716C1.43828 20.5368 1.41712 20.4967 1.40431 20.4537C1.3915 20.4108 1.38729 20.3657 1.39191 20.321C1.39653 20.2764 1.40989 20.2331 1.43123 20.1937C1.45258 20.1542 1.48149 20.1193 1.51631 20.091C1.55113 20.0628 1.59118 20.0416 1.63418 20.0288C1.67717 20.016 1.72227 20.0118 1.76689 20.0164C1.81152 20.021 1.8548 20.0344 1.89426 20.0557L3.51416 20.9312C3.58107 20.9673 3.63402 21.0248 3.6646 21.0944C3.69518 21.164 3.70166 21.2418 3.68299 21.3155C3.66433 21.3892 3.6216 21.4546 3.56157 21.5013C3.50155 21.548 3.42766 21.5733 3.35162 21.5732H3.35128ZM4.69221 9.16748V15.0342C4.69218 15.0884 4.70507 15.1419 4.72981 15.1901C4.75455 15.2384 4.79043 15.2801 4.83449 15.3117C4.87854 15.3433 4.9295 15.364 4.98314 15.3721C5.03678 15.3801 5.09156 15.3752 5.14294 15.3579L6.5508 14.8832L8.05323 17.0133C8.09504 17.0725 8.1546 17.1169 8.22331 17.14C8.29201 17.1631 8.36629 17.1638 8.43539 17.1419C8.5045 17.12 8.56484 17.0766 8.60767 17.0182C8.65051 16.9597 8.67363 16.8891 8.67367 16.8166V11.3194L4.69221 9.16748Z"
//                 fill="#FFB655"
//               />
//               <path
//                 d="M0.36586 6.82926L13 13.6585L25.6342 6.82926L13 0L0.36586 6.82926Z"
//                 fill="#FC9F30"
//               />
//               <path
//                 d="M4.67444 9.15788L8.69141 11.3292L21.3256 4.50032L17.3086 2.32861L4.67444 9.15788Z"
//                 fill="#DB811F"
//               />
//             </svg>
//             <h1 className="text-xl font-medium text-white">You have 0 new orders</h1>
//             <Button
//               className="bg-[#44B46E] hover:bg-[#44B46E] rounded-full text-white px-6"
//               onClick={handleDetailsClick}
//             >
//               Details
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Filter Tabs */}
//       <div className="flex items-center gap-4 mb-6">
//         {["Today", "Tomorrow", "Yesterday", "Custom Date"].map((tab) => (
//           <Button
//             key={tab}
//             variant={activeTab === tab ? "default" : "ghost"}
//             onClick={() => {
//               setActiveTab(tab);
//               setShowPendingOrders(false); // Reset to all orders when changing tabs
//               if (allOrdersData?.data?.results?.data) {
//                 const filteredOrders = filterOrdersByTab(allOrdersData.data.results.data);
//                 setOrders(mapApiToOrders(filteredOrders));
//               }
//               setCurrentPage(1); // Reset to first page on tab change
//             }}
//             className={
//               activeTab === tab
//                 ? "bg-gray-700 text-white"
//                 : "text-gray-400 hover:text-white hover:bg-gray-700"
//             }
//           >
//             {tab}
//           </Button>
//         ))}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="text-gray-400 hover:text-white hover:bg-gray-700"
//         >
//           <Calendar className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="bg-[#23252b] rounded-lg overflow-hidden">
//         <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-600 text-sm bg-[#2c2e33] font-medium text-gray-300">
//           <div>Order ID</div>
//           <div>Date</div>
//           <div>Customer Name</div>
//           <div>Shop Name</div>
//           <div>Amount</div>
//           <div>Status</div>
//           <div>Action</div>
//         </div>
//         <div className="divide-y divide-gray-600">
//           {paginatedOrders.map((order, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
//             >
//               <div className="text-white font-medium">{order.id}</div>
//               <div className="text-gray-300">{order.date}</div>
//               <div className="text-white">{order.customerName}</div>
//               <div className="text-gray-300">{order.shopName}</div>
//               <div className="text-white font-medium">{order.amount}</div>
//               <div>
//                 <Select
//                   value={order.status}
//                   onValueChange={(value: "pending" | "delivered" | "shipped") =>
//                     handleStatusChange(index, value)
//                   }
//                 >
//                   <SelectTrigger className="w-32 bg-transparent border-none p-0 h-auto">
//                     <SelectValue className={`${getStatusColor(order.status)} font-medium`} />
//                     <ChevronDown className="h-3 w-3 ml-1 text-gray-400" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-[#2a2a2a] border-gray-600">
//                     <SelectItem value="pending" className="text-red-400">
//                       Pending
//                     </SelectItem>
//                     <SelectItem value="delivered" className="text-green-400">
//                       Delivered
//                     </SelectItem>
//                     <SelectItem value="shipped" className="text-blue-400">
//                       Shipped
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   size="sm"
//                   onClick={() => handleAction(index, "approve")}
//                   className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600 rounded-full"
//                 >
//                   <Check className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => handleAction(index, "info")}
//                   className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full"
//                 >
//                   <Info className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => handleAction(index, "delete")}
//                   className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 rounded-full"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal for Order Details */}
//       <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-400">Date</p>
//                   <p>{selectedOrder.date}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Customer Name</p>
//                   <p>{selectedOrder.customerName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Shop Name</p>
//                   <p>{selectedOrder.shopName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Total Amount</p>
//                   <p>{selectedOrder.amount}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Status</p>
//                   <p className={`${getStatusColor(selectedOrder.status)} font-medium`}>
//                     {selectedOrder.status}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Shipping Address</p>
//                   <p>{selectedOrder.shippingAddress || "N/A"}</p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-400 mb-2">Items</p>
//                 <div className="bg-[#2c2e33] rounded-lg overflow-hidden">
//                   <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-gray-300 border-b border-gray-600">
//                     <div>Product Name</div>
//                     <div>Quantity</div>
//                     <div>MRP</div>
//                     <div>Discount</div>
//                     <div>Total</div>
//                   </div>
//                   {selectedOrder.items?.map((item, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-5 gap-4 p-4 text-sm border-b border-gray-600 last:border-b-0"
//                     >
//                       <div>{item.product_name}</div>
//                       <div>{item.quantity}</div>
//                       <div>₹{item.mrp}</div>
//                       <div>{item.discount_percent}% (₹{item.discount.toFixed(2)})</div>
//                       <div>₹{item.items_total.toFixed(2)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//           <DialogClose asChild>
//             <Button className="mt-4 bg-gray-700 hover:bg-gray-600">Close</Button>
//           </DialogClose>
//         </DialogContent>
//       </Dialog>

//       {/* Pagination */}
//       <div className="flex items-center justify-center gap-2 mt-6">
//         {renderPagination()}
//       </div>
//     </div>
//   );
// }

// // Filter orders based on active tab (moved outside component for reusability)
// const filterOrdersByTab = (data: any[], activeTab: string) => {
//   const today = new Date().toISOString().split("T")[0]; // 2025-08-05
//   return data.filter((order) => {
//     const orderDate = new Date(order.order_date).toISOString().split("T")[0];
//     switch (activeTab) {
//       case "Today":
//         return orderDate === today;
//       case "Tomorrow":
//         const tomorrow = new Date();
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         return orderDate === tomorrow.toISOString().split("T")[0];
//       case "Yesterday":
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         return orderDate === yesterday.toISOString().split("T")[0];
//       case "Custom Date":
//         return true;
//       default:
//         return true;
//     }
//   });
// }

"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  useAllOrdersQuery,
  useDeleteOrderMutation,
  usePendingProductsQuery,
} from "@/redux/feature/orderSlice";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Order {
  id: string;
  date: string;
  customerName: string;
  shopName: string;
  amount: string;
  status: "pending" | "delivered" | "shipped";
  shippingAddress?: string;
  items?: Array<{
    product: number;
    product_name: string;
    quantity: number;
    mrp: string;
    discount_percent: string;
    discount: number;
    items_total: number;
  }>;
}

// Helper functions
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const mapApiToOrders = (apiData: any[]): Order[] =>
  apiData.map((order) => ({
    id: `#${order.order_id}`,
    date: formatDate(order.order_date),
    customerName: order.user_id ? `User-${order.user_id}` : "Unknown",
    shopName: "MJ Pharma",
    amount: `₹${order.final_amount.toFixed(2)}`,
    status: order.order_status.toLowerCase() as "pending" | "delivered" | "shipped",
    shippingAddress: order.shipping_address,
    items: order.items,
  }));

const getStatusColor = (status: string) =>
({
  pending: "text-red-400",
  delivered: "text-green-400",
  shipped: "text-blue-400",
  default: "text-gray-400",
}[status.toLowerCase()] || "text-gray-400");

export default function Component() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const itemsPerPage = 7;

  // API calls
  const { 
    data: allOrdersData, 
    isLoading: allOrdersLoading, 
    isError: allOrdersError, 
    refetch: refetchAllOrders 
  } = useAllOrdersQuery({ page, pageSize: itemsPerPage });

  const { 
    data: pendingData, 
    isLoading: pendingLoading, 
    isError: pendingError, 
    refetch: refetchPendingOrders 
  } = usePendingProductsQuery({ page, pageSize: itemsPerPage });

  const [deleteOrder] = useDeleteOrderMutation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Update orders based on active tab
  useEffect(() => {
    if (activeTab === "all" && allOrdersData?.data?.results?.data) {
      setOrders(mapApiToOrders(allOrdersData.data.results.data));
      setTotalOrders(allOrdersData.data.count || 0);
    } else if (activeTab === "pending" && pendingData?.data) {
      setOrders(mapApiToOrders(pendingData.data));
      setTotalOrders(pendingData.total || 0);
    }
  }, [activeTab, allOrdersData, pendingData]);

  const handleStatusChange = (orderIndex: number, newStatus: "pending" | "delivered" | "shipped") =>
    setOrders((prev) =>
      prev.map((order, index) =>
        index === orderIndex ? { ...order, status: newStatus } : order
      )
    );

  const handleAction = (orderIndex: number, action: "approve" | "info" | "delete") => {
    switch (action) {
      case "approve":
        handleStatusChange(orderIndex, "delivered");
        break;
      case "info":
        setSelectedOrder(orders[orderIndex]);
        break;
      case "delete":
        const orderId = parseInt(orders[orderIndex].id.replace(/^#/, ""));
        if (!isNaN(orderId)) handleDelete(orderId);
        break;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully!", { position: "top-right" });
      if (activeTab === "all") {
        refetchAllOrders();
      } else {
        refetchPendingOrders();
      }
    } catch {
      toast.error("Failed to delete order!", { position: "top-right" });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalOrders / itemsPerPage);
    
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="text-white hover:bg-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages, page - 2 + i));
          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className={
                page === pageNum
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "text-white hover:bg-gray-700"
              }
            >
              {pageNum}
            </Button>
          );
        })}
        
        {totalPages > 5 && page + 2 < totalPages && (
          <>
            <span key="ellipsis" className="text-gray-400 px-2">...</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="text-white hover:bg-gray-700"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="text-white hover:bg-gray-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const isLoading = activeTab === "all" ? allOrdersLoading : pendingLoading;
  const isError = activeTab === "all" ? allOrdersError : pendingError;

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (isError) return <div className="text-red-400">Error loading orders</div>;

  return (
    <div className="text-white pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg
              width="26"
              height="28"
              viewBox="0 0 26 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.6342 6.82921V21.1707L13 27.9999L0.36586 21.1707V6.82921L1.08293 6.44336L13 12.8834L24.9171 6.44336L25.6342 6.82921Z"
                fill="#FFB655"
              />
              <path
                d="M13 13.6584V27.9998L0.36586 21.1706V6.8291L13 13.6584Z"
                fill="#FCCC97"
              />
              <path
                d="M6.19567 21.9461C6.13916 21.946 6.08354 21.9319 6.03382 21.9051L1.56918 19.492C1.48949 19.4489 1.43018 19.3758 1.40431 19.289C1.37844 19.2022 1.38813 19.1086 1.43123 19.0289C1.47434 18.9492 1.54734 18.8899 1.63418 18.8641C1.72101 18.8382 1.81456 18.8479 1.89426 18.891L6.35855 21.3041C6.42549 21.3402 6.47845 21.3977 6.50902 21.4673C6.5396 21.537 6.54605 21.6148 6.52734 21.6886C6.50864 21.7623 6.46585 21.8277 6.40576 21.8743C6.34568 21.921 6.27174 21.9462 6.19567 21.9461ZM3.35128 21.5732C3.29477 21.5732 3.23914 21.5591 3.18943 21.5322L1.56918 20.6567C1.52972 20.6353 1.49485 20.6064 1.46657 20.5716C1.43828 20.5368 1.41712 20.4967 1.40431 20.4537C1.3915 20.4108 1.38729 20.3657 1.39191 20.321C1.39653 20.2764 1.40989 20.2331 1.43123 20.1937C1.45258 20.1542 1.48149 20.1193 1.51631 20.091C1.55113 20.0628 1.59118 20.0416 1.63418 20.0288C1.67717 20.016 1.72227 20.0118 1.76689 20.0164C1.81152 20.021 1.8548 20.0344 1.89426 20.0557L3.51416 20.9312C3.58107 20.9673 3.63402 21.0248 3.6646 21.0944C3.69518 21.164 3.70166 21.2418 3.68299 21.3155C3.66433 21.3892 3.6216 21.4546 3.56157 21.5013C3.50155 21.548 3.42766 21.5733 3.35162 21.5732H3.35128ZM4.69221 9.16748V15.0342C4.69218 15.0884 4.70507 15.1419 4.72981 15.1901C4.75455 15.2384 4.79043 15.2801 4.83449 15.3117C4.87854 15.3433 4.9295 15.364 4.98314 15.3721C5.03678 15.3801 5.09156 15.3752 5.14294 15.3579L6.5508 14.8832L8.05323 17.0133C8.09504 17.0725 8.1546 17.1169 8.22331 17.14C8.29201 17.1631 8.36629 17.1638 8.43539 17.1419C8.5045 17.12 8.56484 17.0766 8.60767 17.0182C8.65051 16.9597 8.67363 16.8891 8.67367 16.8166V11.3194L4.69221 9.16748Z"
                fill="#FFB655"
              />
              <path
                d="M0.36586 6.82926L13 13.6585L25.6342 6.82926L13 0L0.36586 6.82926Z"
                fill="#FC9F30"
              />
              <path
                d="M4.67444 9.15788L8.69141 11.3292L21.3256 4.50032L17.3086 2.32861L4.67444 9.15788Z"
                fill="#DB811F"
              />
            </svg>
            <h1 className="text-xl font-medium text-white">
              {activeTab === "pending" 
                ? `You have ${pendingData?.total || 0} pending orders` 
                : `Total orders: ${totalOrders}`}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 mb-6">
        {["Today", "Tomorrow", "Yesterday", "Custom Date"].map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => {
              // Implement date filtering if needed
            }}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {tab}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#23252b] rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-600 text-sm bg-[#2c2e33] font-medium text-gray-300">
          <div>Order ID</div>
          <div>Date</div>
          <div>Customer Name</div>
          <div>Shop Name</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        <div className="divide-y divide-gray-600">
          {orders.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-white font-medium">{order.id}</div>
              <div className="text-gray-300">{order.date}</div>
              <div className="text-white">{order.customerName}</div>
              <div className="text-gray-300">{order.shopName}</div>
              <div className="text-white font-medium">{order.amount}</div>
              <div>
                <Select
                  value={order.status}
                  onValueChange={(value: "pending" | "delivered" | "shipped") =>
                    handleStatusChange(index, value)
                  }
                >
                  <SelectTrigger className="w-32 bg-transparent border-none p-0 h-auto">
                    <SelectValue className={`${getStatusColor(order.status)} font-medium`} />
                    <ChevronDown className="h-3 w-3 ml-1 text-gray-400" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-gray-600">
                    <SelectItem value="pending" className="text-red-400">
                      Pending
                    </SelectItem>
                    <SelectItem value="delivered" className="text-green-400">
                      Delivered
                    </SelectItem>
                    <SelectItem value="shipped" className="text-blue-400">
                      Shipped
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "approve")}
                  className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600 rounded-full"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "info")}
                  className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "delete")}
                  className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Order Details */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Customer Name</p>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Shop Name</p>
                  <p>{selectedOrder.shopName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p>{selectedOrder.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`${getStatusColor(selectedOrder.status)} font-medium`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Shipping Address</p>
                  <p>{selectedOrder.shippingAddress || "N/A"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Items</p>
                <div className="bg-[#2c2e33] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-gray-300 border-b border-gray-600">
                    <div>Product Name</div>
                    <div>Quantity</div>
                    <div>MRP</div>
                    <div>Discount</div>
                    <div>Total</div>
                  </div>
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 p-4 text-sm border-b border-gray-600 last:border-b-0"
                    >
                      <div>{item.product_name}</div>
                      <div>{item.quantity}</div>
                      <div>₹{item.mrp}</div>
                      <div>{item.discount_percent}% (₹{item.discount.toFixed(2)})</div>
                      <div>₹{item.items_total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogClose asChild>
            <Button className="mt-4 bg-gray-700 hover:bg-gray-600">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}