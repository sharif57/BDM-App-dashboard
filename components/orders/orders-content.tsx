
// "use client";

// import { useEffect, useState } from "react";
// import { Label } from "@/components/ui/label";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Info,
//   Trash2,
//   PrinterCheck,
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
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   useAllOrdersQuery,
//   useDeleteOrderMutation,
//   usePendingProductsQuery,
//   useUpdateOrdersMutation,
// } from "@/redux/feature/orderSlice";
// import { toast } from "sonner";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface Order {
//   id: string;
//   date: string;
//   customerName: string;
//   shopName: string;
//   amount: string;
//   status: "pending" | "delivered" | "shipped" | "cancelled";
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

// const formatDateForAPI = (date: Date) =>
//   date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

// const mapApiToOrders = (apiData: any[]): Order[] =>
//   apiData.map((order) => ({
//     id: `#${order.order_id}`,
//     date: formatDate(order.order_date),
//     customerName: order.user_id ? `User-${order.user_id}` : "Unknown",
//     shopName: "MJ Pharma",
//     amount: `৳${order.final_amount.toFixed(2)}`,
//     status: order.order_status.toLowerCase() as "pending" | "delivered" | "shipped" | "cancelled",
//     shippingAddress: order.shipping_address,
//     items: order.items,
//   }));

// const getStatusColor = (status: string) =>
//   ({
//     pending: "text-red-400",
//     delivered: "text-green-400",
//     shipped: "text-blue-400",
//     cancelled: "text-gray-400",
//     default: "text-gray-400",
//   }[status.toLowerCase()] || "text-gray-400");

// export default function Component() {
//   const [activeTab, setActiveTab] = useState("all");
//   const [page, setPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [statusOrder, setStatusOrder] = useState<Order | null>(null);
//   const [newStatus, setNewStatus] = useState<"pending" | "delivered" | "shipped" | "">("");
//   const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);
//   const itemsPerPage = 7;
//   const [date, setDate] = useState<Date | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [totalOrders, setTotalOrders] = useState(0);

//   // API calls with date filter
//   const {
//     data: allOrdersData,
//     isLoading: allOrdersLoading,
//     isError: allOrdersError,
//     refetch: refetchAllOrders,
//   } = useAllOrdersQuery({ page, pageSize: itemsPerPage, date: date ? formatDateForAPI(date) : undefined });

//   const {
//     data: pendingData,
//     isLoading: pendingLoading,
//     isError: pendingError,
//     refetch: refetchPendingOrders,
//   } = usePendingProductsQuery({ page, pageSize: itemsPerPage, date: date ? formatDateForAPI(date) : undefined });

//   const [deleteOrder] = useDeleteOrderMutation();
//   const [updateOrders] = useUpdateOrdersMutation();

//   // Update orders based on active tab and date
//   useEffect(() => {
//     if (activeTab === "all" && allOrdersData?.results?.data) {
//       setOrders(mapApiToOrders(allOrdersData.results.data));
//       setTotalOrders(allOrdersData.count || 0);
//     } else if (activeTab === "pending" && pendingData?.data) {
//       setOrders(mapApiToOrders(pendingData.data));
//       setTotalOrders(pendingData.total || 0);
//     }
//   }, [activeTab, allOrdersData, pendingData, date]);

//   // Reset page when date or tab changes
//   useEffect(() => {
//     setPage(1);
//   }, [date, activeTab]);

//   const handleStatusChange = (orderIndex: number, newStatus: "pending" | "delivered" | "shipped") =>
//     setOrders((prev) =>
//       prev.map((order, index) =>
//         index === orderIndex ? { ...order, status: newStatus } : order
//       )
//     );

//   const handleAction = (orderIndex: number, action: "approve" | "info" | "delete") => {
//     switch (action) {
//       case "approve":
//         setStatusOrder(orders[orderIndex]);
//         setNewStatus(orders[orderIndex].status);
//         break;
//       case "info":
//         setSelectedOrder(orders[orderIndex]);
//         break;
//       case "delete":
//         setDeleteConfirmOrder(orders[orderIndex]);
//         break;
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteOrder(id).unwrap();
//       toast.success("Order deleted successfully!", { position: "top-right" });
//       setDeleteConfirmOrder(null);
//       if (activeTab === "all") {
//         refetchAllOrders();
//       } else {
//         refetchPendingOrders();
//       }
//     } catch {
//       toast.error("Failed to delete order!", { position: "top-right" });
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!statusOrder || !newStatus) return;
//     const orderId = parseInt(statusOrder.id.replace(/^#/, ""));
//     if (isNaN(orderId)) {
//       toast.error("Invalid order ID!", { position: "top-right" });
//       return;
//     }
//     try {
//       await updateOrders({ id: orderId, data: { order_status: newStatus } }).unwrap();
//       toast.success("Order status updated successfully!", { position: "top-right" });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === statusOrder.id ? { ...order, status: newStatus } : order
//         )
//       );
//       setStatusOrder(null);
//       setNewStatus("");
//       if (activeTab === "all") {
//         refetchAllOrders();
//       } else {
//         refetchPendingOrders();
//       }
//     } catch (error) {
//       toast.error("Failed to update order status!", { position: "top-right" });
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleClearDate = () => {
//     setDate(null);
//   };

//   const renderPagination = () => {
//     const totalPages = Math.ceil(totalOrders / itemsPerPage);

//     return (
//       <div className="flex items-center justify-center gap-2 mt-6">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handlePageChange(Math.max(1, page - 1))}
//           disabled={page === 1}
//           className="text-white hover:bg-gray-700"
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>

//         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//           const pageNum = Math.max(1, Math.min(totalPages, page - 2 + i));
//           return (
//             <Button
//               key={pageNum}
//               variant={page === pageNum ? "default" : "ghost"}
//               size="sm"
//               onClick={() => handlePageChange(pageNum)}
//               className={
//                 page === pageNum
//                   ? "bg-green-500 hover:bg-green-600 text-white"
//                   : "text-white hover:bg-gray-700"
//               }
//             >
//               {pageNum}
//             </Button>
//           );
//         })}

//         {totalPages > 5 && page + 2 < totalPages && (
//           <>
//             <span key="ellipsis" className="text-gray-400 px-2">
//               ...
//             </span>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handlePageChange(totalPages)}
//               className="text-white hover:bg-gray-700"
//             >
//               {totalPages}
//             </Button>
//           </>
//         )}

//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
//           disabled={page === totalPages}
//           className="text-white hover:bg-gray-700"
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     );
//   };

//   const isLoading = activeTab === "all" ? allOrdersLoading : pendingLoading;
//   const isError = activeTab === "all" ? allOrdersError : pendingError;

//   if (isLoading) return <div className="text-white">Loading...</div>;
//   if (isError) return <div className="text-red-400">Error loading orders</div>;

//   return (
//     <div className="text-white pt-6">
//       {/* Header */}
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
//               {/* SVG content unchanged */}
//             </svg>
//             <h1 className="text-xl font-medium text-white">
//               {activeTab === "pending"
//                 ? `You have ${pendingData?.total || 0} pending orders`
//                 : `Total orders: ${totalOrders}`}
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
//         <TabsList>
//           <TabsTrigger value="all">All Orders</TabsTrigger>
//           <TabsTrigger value="pending">Pending Orders</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       {/* Date Filter */}
//       <div className="flex items-center gap-4 mb-6">
//         <Label className="text-sm text-gray-400">Date Filter</Label>
//         <div className="flex items-center gap-2">
//           <DatePicker
//             selected={date}
//             onChange={(date: Date | null) => setDate(date)}
//             className="bg-[#2c2e33] text-gray-300 border border-gray-600 rounded-md p-2 w-48"
//             placeholderText="Select date"
//             dateFormat="dd MMMM yyyy"
//           />
//           {date && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleClearDate}
//               className="text-gray-300 hover:text-white hover:bg-gray-700"
//             >
//               Clear
//             </Button>
//           )}
//         </div>
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
//           {orders.map((order, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
//             >
//               <div className="text-white font-medium">{order.id}</div>
//               <div className="text-gray-300">{order.date}</div>
//               <div className="text-white">{order.customerName}</div>
//               <div className="text-gray-300">{order.shopName}</div>
//               <div className="text-white font-medium">{order.amount}</div>
//               <div className={getStatusColor(order.status)}>
//                 {order.status}
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
//                 <PrinterCheck />
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
//                       <div>৳{item.mrp}</div>
//                       <div>
//                         {item.discount_percent}% (৳{item.discount.toFixed(2)})
//                       </div>
//                       <div>৳{item.items_total.toFixed(2)}</div>
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

//       {/* Modal for Status Update */}
//       <Dialog open={!!statusOrder} onOpenChange={() => setStatusOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
//           <DialogHeader>
//             <DialogTitle>Update Order Status - ID: {statusOrder?.id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label className="text-sm text-gray-400">Select New Status</Label>
//               <Select
//                 value={newStatus}
//                 onValueChange={(value: "pending" | "delivered" | "shipped") => setNewStatus(value)}
//               >
//                 <SelectTrigger className="w-full bg-[#2c2e33] border-gray-600">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#2a2a2a] border-gray-600">
//                   <SelectItem value="pending" className="text-red-400">
//                     Pending
//                   </SelectItem>
//                   <SelectItem value="delivered" className="text-green-400">
//                     Delivered
//                   </SelectItem>
//                   <SelectItem value="shipped" className="text-blue-400">
//                     Shipped
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStatusOrder(null)}
//                 className="bg-gray-700 hover:bg-gray-600"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleUpdateStatus}
//                 className="bg-green-500 hover:bg-green-600"
//                 disabled={!newStatus}
//               >
//                 Update Status
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!deleteConfirmOrder} onOpenChange={() => setDeleteConfirmOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete Order</DialogTitle>
//             <DialogDescription className="text-gray-400">
//               Are you sure you want to delete order {deleteConfirmOrder?.id}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="ghost"
//               onClick={() => setDeleteConfirmOrder(null)}
//               className="bg-gray-700 hover:bg-gray-600"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 if (deleteConfirmOrder) {
//                   const orderId = parseInt(deleteConfirmOrder.id.replace(/^#/, ""));
//                   if (!isNaN(orderId)) handleDelete(orderId);
//                 }
//               }}
//               className="bg-red-500 hover:bg-red-600"
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Pagination */}
//       {renderPagination()}
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { Label } from "@/components/ui/label";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Info,
//   Trash2,
//   PrinterCheck,
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
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   useAllOrdersQuery,
//   useDeleteOrderMutation,
//   usePendingProductsQuery,
//   useUpdateOrdersMutation,
// } from "@/redux/feature/orderSlice";
// import { toast } from "sonner";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import html2canvas from "html2canvas";

// interface Order {
//   id: string;
//   date: string;
//   customerName: string;
//   shopName: string;
//   amount: string;
//   status: "pending" | "delivered" | "shipped" | "cancelled";
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

// const formatDateForAPI = (date: Date) =>
//   date.toISOString().split("T")[0];

// const mapApiToOrders = (apiData: any[]): Order[] =>
//   apiData.map((order) => ({
//     id: `#${order.order_id}`,
//     date: formatDate(order.order_date),
//     customerName: order.user_id ? `User-${order.user_id}` : "Unknown",
//     shopName: "MJ Pharma",
//     amount: `৳${order.final_amount.toFixed(2)}`,
//     status: order.order_status.toLowerCase() as "pending" | "delivered" | "shipped" | "cancelled",
//     shippingAddress: order.shipping_address,
//     items: order.items,
//   }));

// const getStatusColor = (status: string) =>
//   ({
//     pending: "text-red-400",
//     delivered: "text-green-400",
//     shipped: "text-blue-400",
//     cancelled: "text-gray-400",
//     default: "text-gray-400",
//   }[status.toLowerCase()] || "text-gray-400");

// export default function Component() {
//   const [activeTab, setActiveTab] = useState("all");
//   const [page, setPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [statusOrder, setStatusOrder] = useState<Order | null>(null);
//   const [newStatus, setNewStatus] = useState<"pending" | "delivered" | "shipped" | "">("");
//   const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);
//   const itemsPerPage = 7;
//   const [date, setDate] = useState<Date | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   const {
//     data: allOrdersData,
//     isLoading: allOrdersLoading,
//     isError: allOrdersError,
//     refetch: refetchAllOrders,
//   } = useAllOrdersQuery({ page, pageSize: itemsPerPage, date: date ? formatDateForAPI(date) : undefined });

//   const {
//     data: pendingData,
//     isLoading: pendingLoading,
//     isError: pendingError,
//     refetch: refetchPendingOrders,
//   } = usePendingProductsQuery({ page, pageSize: itemsPerPage, date: date ? formatDateForAPI(date) : undefined });

//   const [deleteOrder] = useDeleteOrderMutation();
//   const [updateOrders] = useUpdateOrdersMutation();

//   useEffect(() => {
//     if (activeTab === "all" && allOrdersData?.results?.data) {
//       setOrders(mapApiToOrders(allOrdersData.results.data));
//       setTotalOrders(allOrdersData.count || 0);
//     } else if (activeTab === "pending" && pendingData?.data) {
//       setOrders(mapApiToOrders(pendingData.data));
//       setTotalOrders(pendingData.total || 0);
//     }
//   }, [activeTab, allOrdersData, pendingData, date]);

//   useEffect(() => {
//     setPage(1);
//   }, [date, activeTab]);

//   const handleStatusChange = (orderIndex: number, newStatus: "pending" | "delivered" | "shipped") =>
//     setOrders((prev) =>
//       prev.map((order, index) =>
//         index === orderIndex ? { ...order, status: newStatus } : order
//       )
//     );

//   const handleAction = (orderIndex: number, action: "approve" | "info" | "delete" | "download" | "print") => {
//     switch (action) {
//       case "approve":
//         setStatusOrder(orders[orderIndex]);
//         setNewStatus(orders[orderIndex].status);
//         break;
//       case "info":
//         setSelectedOrder(orders[orderIndex]);
//         break;
//       case "delete":
//         setDeleteConfirmOrder(orders[orderIndex]);
//         break;
//       case "download":
//         handleDownloadInvoice(orders[orderIndex]);
//         break;
//       case "print":
//         handlePrintInvoice(orders[orderIndex]);
//         break;
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteOrder(id).unwrap();
//       toast.success("Order deleted successfully!", { position: "top-right" });
//       setDeleteConfirmOrder(null);
//       if (activeTab === "all") {
//         refetchAllOrders();
//       } else {
//         refetchPendingOrders();
//       }
//     } catch {
//       toast.error("Failed to delete order!", { position: "top-right" });
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!statusOrder || !newStatus) return;
//     const orderId = parseInt(statusOrder.id.replace(/^#/, ""));
//     if (isNaN(orderId)) {
//       toast.error("Invalid order ID!", { position: "top-right" });
//       return;
//     }
//     try {
//       await updateOrders({ id: orderId, data: { order_status: newStatus } }).unwrap();
//       toast.success("Order status updated successfully!", { position: "top-right" });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === statusOrder.id ? { ...order, status: newStatus } : order
//         )
//       );
//       setStatusOrder(null);
//       setNewStatus("");
//       if (activeTab === "all") {
//         refetchAllOrders();
//       } else {
//         refetchPendingOrders();
//       }
//     } catch (error) {
//       toast.error("Failed to update order status!", { position: "top-right" });
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleClearDate = () => {
//     setDate(null);
//   };

//   const handleDownloadInvoice = (order: Order) => {
//     if (invoiceRef.current) {
//       html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
//         const link = document.createElement("a");
//         link.download = `invoice_${order.id.replace("#", "")}.png`;
//         link.href = canvas.toDataURL("image/png");
//         link.click();
//       });
//     }
//   };

//   const handlePrintInvoice = (order: Order) => {
//     if (invoiceRef.current) {
//       html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/png");
//         const printWindow = window.open('', '', 'height=600,width=800');
//         if (printWindow) {
//           printWindow.document.write('<html><head><title>Print Invoice</title></head><body>');
//           printWindow.document.write('<img src="' + imgData + '" style="width:100%;">');
//           printWindow.document.write('</body></html>');
//           printWindow.document.close();
//           printWindow.print();
//           printWindow.close();
//         }
//       });
//     }
//   };

//   const renderPagination = () => {
//     const totalPages = Math.ceil(totalOrders / itemsPerPage);

//     return (
//       <div className="flex items-center justify-center gap-2 mt-6">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handlePageChange(Math.max(1, page - 1))}
//           disabled={page === 1}
//           className="text-white hover:bg-gray-700"
//         >
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//           const pageNum = Math.max(1, Math.min(totalPages, page - 2 + i));
//           return (
//             <Button
//               key={pageNum}
//               variant={page === pageNum ? "default" : "ghost"}
//               size="sm"
//               onClick={() => handlePageChange(pageNum)}
//               className={
//                 page === pageNum
//                   ? "bg-green-500 hover:bg-green-600 text-white"
//                   : "text-white hover:bg-gray-700"
//               }
//             >
//               {pageNum}
//             </Button>
//           );
//         })}
//         {totalPages > 5 && page + 2 < totalPages && (
//           <>
//             <span key="ellipsis" className="text-gray-400 px-2">...</span>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => handlePageChange(totalPages)}
//               className="text-white hover:bg-gray-700"
//             >
//               {totalPages}
//             </Button>
//           </>
//         )}
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
//           disabled={page === totalPages}
//           className="text-white hover:bg-gray-700"
//         >
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     );
//   };

//   const isLoading = activeTab === "all" ? allOrdersLoading : pendingLoading;
//   const isError = activeTab === "all" ? allOrdersError : pendingError;

//   if (isLoading) return <div className="text-white">Loading...</div>;
//   if (isError) return <div className="text-red-400">Error loading orders</div>;

//   return (
//     <div className="text-white pt-6">
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
//               {/* SVG content unchanged */}
//             </svg>
//             <h1 className="text-xl font-medium text-white">
//               {activeTab === "pending"
//                 ? `You have ${pendingData?.total || 0} pending orders`
//                 : `Total orders: ${totalOrders}`}
//             </h1>
//           </div>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
//         <TabsList>
//           <TabsTrigger value="all">All Orders</TabsTrigger>
//           <TabsTrigger value="pending">Pending Orders</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <div className="flex items-center gap-4 mb-6">
//         <Label className="text-sm text-gray-400">Date Filter</Label>
//         <div className="flex items-center gap-2">
//           <DatePicker
//             selected={date}
//             onChange={(date: Date | null) => setDate(date)}
//             className="bg-[#2c2e33] text-gray-300 border border-gray-600 rounded-md p-2 w-48"
//             placeholderText="Select date"
//             dateFormat="dd MMMM yyyy"
//           />
//           {date && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleClearDate}
//               className="text-gray-300 hover:text-white hover:bg-gray-700"
//             >
//               Clear
//             </Button>
//           )}
//         </div>
//       </div>

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
//           {orders.map((order, index) => (
//             <div
//               key={index}
//               className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
//             >
//               <div className="text-white font-medium">{order.id}</div>
//               <div className="text-gray-300">{order.date}</div>
//               <div className="text-white">{order.customerName}</div>
//               <div className="text-gray-300">{order.shopName}</div>
//               <div className="text-white font-medium">{order.amount}</div>
//               <div className={getStatusColor(order.status)}>
//                 {order.status}
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
//                 <Button
//                   size="sm"
//                   onClick={() => handleAction(index, "download")}
//                   className="w-8 h-8 p-0 bg-yellow-500 hover:bg-yellow-600 rounded-full"
//                 >
//                   <PrinterCheck className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={handlePrintInvoice}
                  
//                   className="w-8 h-8 p-0 bg-gray-500 hover:bg-gray-600 rounded-full"
//                 >
//                   <PrinterCheck className="h-4 w-4 rotate-90" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && (
//             <div ref={invoiceRef} className="space-y-4 p-6 bg-white text-black rounded-lg">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <img src="/invoicelogo.jpg" alt="BDM Logo" className="h-12" />
//                 </div>
//                 <h2 className="text-2xl font-bold">INVOICE</h2>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <p><strong>Bill from:</strong></p>
//                   <p>BDM</p>
//                   <p>Bangladeshi Medicine Wholesale Supplier</p>
//                   {/* <p>Street Address, Zip Code</p> */}
//                   {/* <p>Phone Number</p> */}
//                 </div>
//                 <div>
//                   <p><strong>Bill to:</strong></p>
//                   <p>{selectedOrder.customerName}</p>
//                   <p>{selectedOrder.shippingAddress || "N/A"}</p>
//                   {/* <p>Phone   Number</p> */}
//                 </div>
//                 <div>
//                   <p><strong>Invoice Number:</strong> {selectedOrder.id}</p>
//                   <p><strong>Date:</strong> {selectedOrder.date}</p>
//                   <p><strong>Due Date:</strong> {formatDate(new Date().toISOString())}</p>
//                   <p><strong>Total:</strong> {selectedOrder.amount}</p>
//                 </div>
//               </div>
//               <table className="w-full mt-4 border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="border p-2">Item</th>
//                     <th className="border p-2">Rate</th>
//                     <th className="border p-2">Quantity</th>
//                     <th className="border p-2">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedOrder.items?.map((item, idx) => (
//                     <tr key={idx} className="border-t">
//                       <td className="border p-2">{item.product_name}</td>
//                       <td className="border p-2">৳{item.mrp}</td>
//                       <td className="border p-2">{item.quantity}</td>
//                       <td className="border p-2">৳{item.items_total.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="mt-4 text-right">
//                 <p><strong>Subtotal:</strong> {selectedOrder.amount}</p>
//                 {/* <p><strong>Discount:</strong> ৳0.00</p> */}
//                 {/* <p><strong>Tax:</strong> ৳0.00</p> */}
//                 <p><strong>Total:</strong> {selectedOrder.amount}</p>
//               </div>
//               <p className="mt-4"><strong>Terms & Conditions:</strong> Payment due within 30 days.</p>
//             </div>
//           )}
//           {/* <div> */}
//             <Button className="mt-4 bg-gray-700 hover:bg-gray-600" onClick={handleDownloadInvoice}>
//               Download Invoice
//             </Button>
//             <Button className="mt-4 bg-gray-700 hover:bg-gray-600" onClick={handlePrintInvoice}>
//               Print Invoice
//             </Button>
//           {/* </div> */}
//           <DialogClose asChild>
//             <Button className="mt-4 bg-gray-700 hover:bg-gray-600">Close</Button>
//           </DialogClose>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={!!statusOrder} onOpenChange={() => setStatusOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
//           <DialogHeader>
//             <DialogTitle>Update Order Status - ID: {statusOrder?.id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label className="text-sm text-gray-400">Select New Status</Label>
//               <Select
//                 value={newStatus}
//                 onValueChange={(value: "pending" | "delivered" | "shipped") => setNewStatus(value)}
//               >
//                 <SelectTrigger className="w-full bg-[#2c2e33] border-gray-600">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-[#2a2a2a] border-gray-600">
//                   <SelectItem value="pending" className="text-red-400">Pending</SelectItem>
//                   <SelectItem value="delivered" className="text-green-400">Delivered</SelectItem>
//                   <SelectItem value="shipped" className="text-blue-400">Shipped</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="ghost"
//                 onClick={() => setStatusOrder(null)}
//                 className="bg-gray-700 hover:bg-gray-600"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleUpdateStatus}
//                 className="bg-green-500 hover:bg-green-600"
//                 disabled={!newStatus}
//               >
//                 Update Status
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={!!deleteConfirmOrder} onOpenChange={() => setDeleteConfirmOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete Order</DialogTitle>
//             <DialogDescription className="text-gray-400">
//               Are you sure you want to delete order {deleteConfirmOrder?.id}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="ghost"
//               onClick={() => setDeleteConfirmOrder(null)}
//               className="bg-gray-700 hover:bg-gray-600"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 if (deleteConfirmOrder) {
//                   const orderId = parseInt(deleteConfirmOrder.id.replace(/^#/, ""));
//                   if (!isNaN(orderId)) handleDelete(orderId);
//                 }
//               }}
//               className="bg-red-500 hover:bg-red-600"
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {renderPagination()}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  Trash2,
  PrinterCheck,
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useAllOrdersQuery,
  useDeleteOrderMutation,
  usePendingProductsQuery,
  useUpdateOrdersMutation,
} from "@/redux/feature/orderSlice";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import html2canvas from "html2canvas";

interface Order {
  id: string;
  date: string;
  customerName: string;
  shopName: string;
  amount: string;
  status: "pending" | "delivered" | "shipped" | "cancelled";
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

const formatDateForAPI = (date: Date) =>
  date.toISOString().split("T")[0];

const mapApiToOrders = (apiData: any[]): Order[] =>
  apiData.map((order) => ({
    id: `#${order.order_id}`,
    date: formatDate(order.order_date),
    customerName: order.user_id ? `User-${order.user_id}` : "Unknown",
    shopName: "MJ Pharma",
    amount: `৳${order.final_amount.toFixed(2)}`,
    status: order.order_status.toLowerCase() as "pending" | "delivered" | "shipped" | "cancelled",
    shippingAddress: order.shipping_address,
    items: order.items,
  }));

const getStatusColor = (status: string) =>
  ({
    pending: "text-red-400",
    delivered: "text-green-400",
    shipped: "text-blue-400",
    cancelled: "text-gray-400",
    default: "text-gray-400",
  }[status.toLowerCase()] || "text-gray-400");

export default function Component() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<"pending" | "delivered" | "shipped" | "">("");
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);
  const itemsPerPage = 7;
  const [date, setDate] = useState<Date | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const {
    data: allOrdersData,
    isLoading: allOrdersLoading,
    isError: allOrdersError,
    refetch: refetchAllOrders,
  } = useAllOrdersQuery({ page, pageSize: itemsPerPage, date: date ? formatDateForAPI(date) : undefined });

  const {
    data: pendingData,
    isLoading: pendingLoading,
    isError: pendingError,
    refetch: refetchPendingOrders,
  } = usePendingProductsQuery({ page, pageSize: itemsPerPage, date: date ? formatDateForAPI(date) : undefined });

  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrders] = useUpdateOrdersMutation();

  useEffect(() => {
    if (activeTab === "all" && allOrdersData?.results?.data) {
      setOrders(mapApiToOrders(allOrdersData.results.data));
      setTotalOrders(allOrdersData.count || 0);
    } else if (activeTab === "pending" && pendingData?.data) {
      setOrders(mapApiToOrders(pendingData.data));
      setTotalOrders(pendingData.total || 0);
    }
  }, [activeTab, allOrdersData, pendingData, date]);

  useEffect(() => {
    setPage(1);
  }, [date, activeTab]);

  const handleStatusChange = (orderIndex: number, newStatus: "pending" | "delivered" | "shipped") =>
    setOrders((prev) =>
      prev.map((order, index) =>
        index === orderIndex ? { ...order, status: newStatus } : order
      )
    );

  const handleAction = (orderIndex: number, action: "approve" | "info" | "delete" | "download" | "print") => {
    const order = orders[orderIndex];
    switch (action) {
      case "approve":
        setStatusOrder(order);
        setNewStatus(order.status);
        break;
      case "info":
        setSelectedOrder(order);
        break;
      case "delete":
        setDeleteConfirmOrder(order);
        break;
      case "download":
        handleDownloadInvoice(order);
        break;
      case "print":
        handlePrintInvoice(order);
        break;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully!", { position: "top-right" });
      setDeleteConfirmOrder(null);
      if (activeTab === "all") {
        refetchAllOrders();
      } else {
        refetchPendingOrders();
      }
    } catch {
      toast.error("Failed to delete order!", { position: "top-right" });
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusOrder || !newStatus) return;
    const orderId = parseInt(statusOrder.id.replace(/^#/, ""));
    if (isNaN(orderId)) {
      toast.error("Invalid order ID!", { position: "top-right" });
      return;
    }
    try {
      await updateOrders({ id: orderId, data: { order_status: newStatus } }).unwrap();
      toast.success("Order status updated successfully!", { position: "top-right" });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === statusOrder.id ? { ...order, status: newStatus } : order
        )
      );
      setStatusOrder(null);
      setNewStatus("");
      if (activeTab === "all") {
        refetchAllOrders();
      } else {
        refetchPendingOrders();
      }
    } catch (error) {
      toast.error("Failed to update order status!", { position: "top-right" });
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClearDate = () => {
    setDate(null);
  };

  const handleDownloadInvoice = (order: Order) => {
    if (invoiceRef.current && order) {
      html2canvas(invoiceRef.current, { scale: 2, useCORS: true }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `invoice_${order.id.replace("#", "")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }).catch((error) => {
        console.error("Error generating invoice image:", error);
        toast.error("Failed to generate invoice image!", { position: "top-right" });
      });
    } else {
      toast.error("Invoice content not found!", { position: "top-right" });
    }
  };

  const handlePrintInvoice = (order: Order) => {
    if (invoiceRef.current && order) {
      html2canvas(invoiceRef.current, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Invoice - ${order.id}</title>
                <style>
                  body { margin: 0; padding: 10mm; }
                  img { width: 100%; }
                </style>
              </head>
              <body>
                <img src="${imgData}" onload="window.print();window.close();" />
              </body>
            </html>
          `);
          printWindow.document.close();
        } else {
          toast.error("Popup blocked! Please allow popups to print.", { position: "top-right" });
        }
      }).catch((error) => {
        console.error("Error generating invoice for printing:", error);
        toast.error("Failed to generate invoice for printing!", { position: "top-right" });
      });
    } else {
      toast.error("Invoice content not found!", { position: "top-right" });
    }
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
              {/* SVG content unchanged */}
            </svg>
            <h1 className="text-xl font-medium text-white">
              {activeTab === "pending"
                ? `You have ${pendingData?.total || 0} pending orders`
                : `Total orders: ${totalOrders}`}
            </h1>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4 mb-6">
        <Label className="text-sm text-gray-400">Date Filter</Label>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            className="bg-[#2c2e33] text-gray-300 border border-gray-600 rounded-md p-2 w-48"
            placeholderText="Select date"
            dateFormat="dd MMMM yyyy"
          />
          {date && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDate}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

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
              <div className={getStatusColor(order.status)}>
                {order.status}
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
                {/* <Button
                  size="sm"
                  onClick={() => handleAction(index, "download")}
                  className="w-8 h-8 p-0 bg-yellow-500 hover:bg-yellow-600 rounded-full"
                >
                  <PrinterCheck className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "print")}
                  className="w-8 h-8 p-0 bg-gray-500 hover:bg-gray-600 rounded-full"
                >
                  <PrinterCheck className="h-4 w-4 rotate-90" />
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div ref={invoiceRef} className="space-y-4 p-6 bg-white text-black rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <img src="/invoicelogo.jpg" alt="BDM Logo" className="h-12" />
                </div>
                <h2 className="text-2xl font-bold">INVOICE</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p><strong>Bill from:</strong></p>
                  <p>BDM</p>
                  <p>Bangladeshi Medicine Wholesale Supplier</p>
                </div>
                <div>
                  <p><strong>Bill to:</strong></p>
                  <p>{selectedOrder.customerName}</p>
                  <p>{selectedOrder.shippingAddress || "N/A"}</p>
                </div>
                <div>
                  <p><strong>Invoice Number:</strong> {selectedOrder.id}</p>
                  <p><strong>Date:</strong> {selectedOrder.date}</p>
                  <p><strong>Due Date:</strong> {formatDate(new Date().toISOString())}</p>
                  <p><strong>Total:</strong> {selectedOrder.amount}</p>
                </div>
              </div>
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="border p-2">{item.product_name}</td>
                      <td className="border p-2">৳{item.mrp}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">৳{item.items_total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <p><strong>Subtotal:</strong> {selectedOrder.amount}</p>
                <p><strong>Total:</strong> {selectedOrder.amount}</p>
              </div>
              <p className="mt-4"><strong>Terms & Conditions:</strong> Payment due within 30 days.</p>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button
              className="bg-gray-700 hover:bg-gray-600 mr-2"
              onClick={() => selectedOrder && handleDownloadInvoice(selectedOrder)}
            >
              Download Invoice
            </Button>
            <Button
              className="bg-gray-700 hover:bg-gray-600"
              onClick={() => selectedOrder && handlePrintInvoice(selectedOrder)}
            >
              Print Invoice
            </Button>
            <DialogClose asChild>
              <Button className="bg-gray-700 hover:bg-gray-600">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!statusOrder} onOpenChange={() => setStatusOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status - ID: {statusOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-400">Select New Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value: "pending" | "delivered" | "shipped") => setNewStatus(value)}
              >
                <SelectTrigger className="w-full bg-[#2c2e33] border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-gray-600">
                  <SelectItem value="pending" className="text-red-400">Pending</SelectItem>
                  <SelectItem value="delivered" className="text-green-400">Delivered</SelectItem>
                  <SelectItem value="shipped" className="text-blue-400">Shipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setStatusOrder(null)}
                className="bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                className="bg-green-500 hover:bg-green-600"
                disabled={!newStatus}
              >
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmOrder} onOpenChange={() => setDeleteConfirmOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete order {deleteConfirmOrder?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmOrder(null)}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deleteConfirmOrder) {
                  const orderId = parseInt(deleteConfirmOrder.id.replace(/^#/, ""));
                  if (!isNaN(orderId)) handleDelete(orderId);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {renderPagination()}
    </div>
  );
}