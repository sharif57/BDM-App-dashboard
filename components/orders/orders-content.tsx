
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
// import { jsPDF } from "jspdf";

// interface Order {
//   id: string;
//   date: string;
//   customerName: string;
//   shopName: string;
//   invoiceNumber: string;
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
//     shopName: order.shop_name,
//     amount: `৳${order.final_amount.toFixed(2)}`,
//     status: order.order_status.toLowerCase() as "pending" | "delivered" | "shipped" | "cancelled",
//     shippingAddress: order.shipping_address,
//     items: order.items,
//     name: order.full_name,
//     invoiceNumber: order.invoice_number,
//     delivery_charge: order.delivery_charge,
//     total_amount: order.total_amount

//   }));

// const getStatusColor = (status: string) =>
// ({
//   pending: "text-red-400",
//   delivered: "text-green-400",
//   shipped: "text-blue-400",
//   cancelled: "text-gray-400",
//   default: "text-gray-400",
// }[status.toLowerCase()] || "text-gray-400");

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



//   const handleAction = (orderIndex: number, action: "approve" | "info" | "delete" | "download" | "print") => {
//     const order = orders[orderIndex];
//     switch (action) {
//       case "approve":
//         setStatusOrder(order);
//         setNewStatus(order.status);
//         break;
//       case "info":
//         setSelectedOrder(order);
//         break;
//       case "delete":
//         setDeleteConfirmOrder(order);
//         break;
//       case "download":
//         handleDownloadInvoice(order);
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
//     if (invoiceRef.current && order) {
//       html2canvas(invoiceRef.current, { scale: 2, useCORS: true }).then((canvas) => {
//         const imgData = canvas.toDataURL("image/jpeg", 1.0); // Use JPEG for better PDF quality
//         const pdf = new jsPDF({
//           orientation: "portrait",
//           unit: "mm",
//           format: "a5", // Set to A5 size
//         });

//         const imgWidth = 128; // Width of the image in the PDF (A5 width - margins: 148mm - 10mm left - 10mm right)
//         const pageHeight = 200; // A5 height in mm (210mm) - 10mm top margin
//         const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate proportional height
//         let heightLeft = imgHeight;
//         let position = 5; // Top margin

//         // Add image to PDF
//         pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);

//         // Handle multi-page PDF if content is too long
//         heightLeft -= pageHeight;
//         while (heightLeft >= 0) {
//           position = heightLeft - imgHeight + 10; // Adjust position for next page
//           pdf.addPage();
//           pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//         }

//         // Download the PDF
//         pdf.save(`invoice_${order.id.replace("#", "")}.pdf`);
//       }).catch((error) => {
//         console.error("Error generating invoice PDF:", error);
//         toast.error("Failed to generate invoice PDF!", { position: "top-right" });
//       });
//     } else {
//       toast.error("Invoice content not found!", { position: "top-right" });
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

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-2xl ">
//           <DialogHeader>
//             <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && (
//             <div ref={invoiceRef} className="space-y-4 p-6 bg-white text-black rounded-lg">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <img src="/invoicelogo.jpg" alt="BDM Logo" className="h-12" />
//                 </div>
//                 <h2 className="text-2xl font-bold">{selectedOrder?.invoiceNumber}</h2>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <div>
//                   <p><strong>Bill from:</strong></p>
//                   <p>Bangladesh Medicine (BDM)</p>
//                   <p>Wholesale Supplier</p>
//                 </div>
//                 <div>
//                   <p><strong>Bill to:</strong> </p>
//                   <p><strong>Customer Name:</strong> {selectedOrder.name}</p>
//                   <p><strong>Shop Name:</strong> {selectedOrder.shopName}</p>
//                   <p> <strong>Address:</strong> {selectedOrder.shippingAddress || "N/A"}</p>
//                 </div>
//                 <div>
//                   {/* <p><strong>Invoice:</strong> {selectedOrder.invoiceNumber}</p> */}
//                   <p><strong>Date:</strong> {selectedOrder.date}</p>
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
//                       <td className="border p-2">{item.selling_price}</td>
//                       <td className="border p-2">{item.quantity}</td>
//                       <td className="border p-2">{item.items_total.toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="mt-2 ">
//                 {/* <ul>
//                   <li><strong>Subtotal:</strong> {selectedOrder.total_amount}</li>
//                   <li><strong>Delivery Charge:</strong> {selectedOrder.delivery_charge}</li>
//                   <li><strong>Total:</strong> {selectedOrder.amount}</li>
//                 </ul> */}
//                 <ul className="divide-y divide-gray-200  p-4 w-full  flex flex-col justify-end  ">
//                   <li className="flex justify-between py-2">
//                     <span className="text-gray-600 font-medium">Subtotal</span>
//                     <span className="text-gray-800">{selectedOrder.total_amount}</span>
//                   </li>
//                   <li className="flex justify-between py-2">
//                     <span className="text-gray-600 font-medium">Delivery Charge</span>
//                     <span className="text-gray-800">{selectedOrder.delivery_charge}</span>
//                   </li>
//                   <li className="flex justify-between py-2 font-semibold text-lg">
//                     <span className="text-gray-900">Total</span>
//                     <span className="text-green-600">{selectedOrder.amount}</span>
//                   </li>
//                 </ul>

//               </div>
//               <p className="mt-2 text-[8px]"><strong>Terms & Conditions:

//               </strong>  <br /> # BDM আপনাদের সঠিক সময়ে পণ্য ডেলিভারি দিতে প্রতিশ্রুতিবদ্ধ, তাই যত দ্রুত সম্ভব দয়া করে ডেলিভারি ভাইকে ছেড়ে দিবেন। <br />
//                 # অডারকৃত পণ্য ফেরৎ দিলে ডিসকাউন্ট প্রযোজ্য নহে। সর্বোচ্চ ২৫% পণ্য ফেরৎ প্রযোজ্য।
//                 <br />
//                 # BDM সিস্টেমে বকেয়া রেখে পণ্য বিক্রির ব্যবস্থা নেই। তাই এমন বিব্রতকর প্রস্তাব না দেবার জন্য বিশেষভাবে অনুরোধ করছি।
//                 <br />
//                 # সকাল ১০টার আগে অডার পাঠিয়ে দিবেন। শুক্রবার ডেলিভারি কার্যক্রম বন্ধ থাকিবে।
//               </p>
//             </div>
//           )}
//           <DialogFooter className="mt-4">
//             {/* <Button
//               className="bg-gray-700 hover:bg-gray-600 mr-2"
//               onClick={() => selectedOrder && handleDownloadInvoice(selectedOrder)}
//             >
//               Download Invoice
//             </Button> */}

//             <Button
//               className="bg-gray-700 hover:bg-gray-600 mr-2"
//               onClick={() => selectedOrder && handleDownloadInvoice(selectedOrder)}
//             >
//               Download Invoice (PDF)
//             </Button>

//             <DialogClose asChild>
//               <Button className="bg-gray-700 hover:bg-gray-600">Close</Button>
//             </DialogClose>
//           </DialogFooter>
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

// "use client";

// import { useEffect, useState, useRef } from "react";
// import { Label } from "@/components/ui/label";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Check,
//   Info,
//   Trash2,
//   Search,
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
//   useFilterOrdersQuery,
//   usePendingProductsQuery,
//   useUpdateOrdersMutation,
// } from "@/redux/feature/orderSlice";
// import { toast } from "sonner";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import html2canvas from "html2canvas";
// import { jsPDF } from "jspdf";
// import { Input } from "@/components/ui/input";

// // Define interfaces
// interface OrderItem {
//   product: number;
//   quantity: number;
//   product_name?: string; // Optional, for invoice display
//   selling_price?: string; // Optional, for invoice display
//   items_total?: number; // Optional, for invoice display
// }

// interface Order {
//   id: string;
//   date: string;
//   customerName: string;
//   shopName: string;
//   invoiceNumber: string;
//   amount: string;
//   status: "pending" | "delivered" | "shipped" | "cancelled";
//   shippingAddress?: string;
//   items?: OrderItem[];
//   name?: string;
//   delivery_charge?: number;
//   total_amount?: number;
// }

// // Define form values for updating order
// interface OrderUpdateFormValues {
//   order_status: "pending" | "delivered" | "shipped" | "cancelled";
//   items: OrderItem[];
// }

// // Helper functions
// const formatDate = (dateString: string) =>
//   new Date(dateString).toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });

// const formatDateForAPI = (date: Date) => date.toISOString().split("T")[0];

// const mapApiToOrders = (apiData: any[]): Order[] =>
//   apiData.map((order) => ({
//     id: `#${order.order_id}`,
//     date: formatDate(order.order_date),
//     customerName: order.user_id ? `User-${order.user_id}` : "Unknown",
//     shopName: order.shop_name,
//     amount: `৳${order.final_amount?.toFixed(2) || "0.00"}`,
//     status: (order.order_status?.toLowerCase() ||
//       "pending") as "pending" | "delivered" | "shipped" | "cancelled",
//     shippingAddress: order.shipping_address,
//     items: order.items || [], // Ensure items is always an array
//     name: order.full_name,
//     invoiceNumber: order.invoice_number,
//     delivery_charge: order.delivery_charge,
//     total_amount: order.total_amount,
//   }));

// const getStatusColor = (status: string) =>
// ({
//   pending: "text-red-400",
//   delivered: "text-green-400",
//   shipped: "text-blue-400",
//   cancelled: "text-gray-400",
//   default: "text-gray-400",
// }[status.toLowerCase()] || "text-gray-400");

// export default function Component() {
//   const [activeTab, setActiveTab] = useState("all");
//   const [page, setPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [statusOrder, setStatusOrder] = useState<Order | null>(null);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [newStatus, setNewStatus] = useState<
//     "pending" | "delivered" | "shipped" | "cancelled" | ""
//   >("");
//   const [items, setItems] = useState<OrderItem[]>([]);
//   const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(
//     null
//   );
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
//   } = useAllOrdersQuery({
//     page,
//     pageSize: itemsPerPage,
//     date: date ? formatDateForAPI(date) : undefined,
//   });

//   const {
//     data: pendingData,
//     isLoading: pendingLoading,
//     isError: pendingError,
//     refetch: refetchPendingOrders,
//   } = usePendingProductsQuery({
//     page,
//     pageSize: itemsPerPage,
//     date: date ? formatDateForAPI(date) : undefined,
//   });

//   // /orders/orders/filter/?from_datetime=2025-09-01T00:00:00&to_datetime=2025-09-10T23:59:59&area=1
//   const {data: filterData } = useFilterOrdersQuery( {
//     from_datetime: date ? formatDateForAPI(date) : undefined,
//     to_datetime: date ? formatDateForAPI(date) : undefined,
//   })

//   const [deleteOrder] = useDeleteOrderMutation();
//   const [updateOrders] = useUpdateOrdersMutation();

//   // Update orders based on active tab
//   useEffect(() => {
//     if (activeTab === "all" && allOrdersData?.results?.data) {
//       setOrders(mapApiToOrders(allOrdersData.results.data));
//       setTotalOrders(allOrdersData.count || 0);
//     } else if (activeTab === "pending" && pendingData?.data) {
//       setOrders(mapApiToOrders(pendingData.data));
//       setTotalOrders(pendingData.total || 0);
//     } else {
//       setOrders([]);
//       setTotalOrders(0);
//     }
//   }, [activeTab, allOrdersData, pendingData, date]);

//   // Reset page when date or tab changes
//   useEffect(() => {
//     setPage(1);
//   }, [date, activeTab]);

//   // Set default status and items when opening update dialog
//   useEffect(() => {
//     if (statusOrder) {
//       setNewStatus(statusOrder.status || "delivered"); // Default to provided status
//       setItems(
//         statusOrder.items?.length
//           ? statusOrder.items
//           : [
//             { product: 4, quantity: 5 },
//             { product: 5, quantity: 1 },
//           ] // Default items from provided data
//       );
//     } else {
//       setNewStatus("");
//       setItems([]);
//     }
//   }, [statusOrder]);

//   const handleAction = (
//     orderIndex: number,
//     action: "approve" | "info" | "delete" | "download"
//   ) => {
//     const order = orders[orderIndex];
//     switch (action) {
//       case "approve":
//         setStatusOrder(order);
//         break;
//       case "info":
//         setSelectedOrder(order);
//         break;
//       case "delete":
//         setDeleteConfirmOrder(order);
//         break;
//       case "download":
//         handleDownloadInvoice(order);
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
//       // Prepare data for update
//       const updateData: OrderUpdateFormValues = {
//         order_status: newStatus,
//         items: items.map(({ product, quantity }) => ({ product, quantity })), // Only send product and quantity
//       };
//       await updateOrders({ id: orderId, data: updateData }).unwrap();
//       toast.success("Order updated successfully!", { position: "top-right" });
//       setOrders((prev) =>
//         prev.map((order) =>
//           order.id === statusOrder.id
//             ? { ...order, status: newStatus, items }
//             : order
//         )
//       );
//       setStatusOrder(null);
//       setNewStatus("");
//       setItems([]);
//       if (activeTab === "all") {
//         refetchAllOrders();
//       } else {
//         refetchPendingOrders();
//       }
//     } catch (error) {
//       toast.error("Failed to update order!", { position: "top-right" });
//     }
//   };

//   const handleAddItem = () => {
//     setItems([...items, { product: 0, quantity: 1 }]);
//   };

//   const handleUpdateItem = (
//     index: number,
//     field: "product" | "quantity",
//     value: number
//   ) => {
//     const updatedItems = [...items];
//     updatedItems[index] = { ...updatedItems[index], [field]: value };
//     setItems(updatedItems);
//   };

//   const handleRemoveItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleClearDate = () => {
//     setDate(null);
//   };

//   const handleDownloadInvoice = (order: Order) => {
//     if (invoiceRef.current && order) {
//       html2canvas(invoiceRef.current, { scale: 2, useCORS: true }).then(
//         (canvas) => {
//           const imgData = canvas.toDataURL("image/jpeg", 1.0);
//           const pdf = new jsPDF({
//             orientation: "portrait",
//             unit: "mm",
//             format: "a5",
//           });

//           const imgWidth = 128;
//           const pageHeight = 200;
//           const imgHeight = (canvas.height * imgWidth) / canvas.width;
//           let heightLeft = imgHeight;
//           let position = 5;

//           pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//           while (heightLeft >= 0) {
//             position = heightLeft - imgHeight + 10;
//             pdf.addPage();
//             pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;
//           }

//           pdf.save(`invoice_${order.id.replace("#", "")}.pdf`);
//         }
//       ).catch((error) => {
//         console.error("Error generating invoice PDF:", error);
//         toast.error("Failed to generate invoice PDF!", { position: "top-right" });
//       });
//     } else {
//       toast.error("Invoice content not found!", { position: "top-right" });
//     }
//   };

//   const handleApplyDateFilter = () => {
//     if (date) {
//       const startDate = new Date(date);
//       const endDate = new Date(date);
//       endDate.setDate(endDate.getDate() + 1);
//       if (activeTab === "all") {
//         refetchAllOrders();
//       } else {
//         refetchPendingOrders(); 
//       }
//     }
//   }

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
//             <span className="text-gray-400 px-2">...</span>
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
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             dateFormat="dd/MM/yyyy"
//             placeholderText="Select a date"
//             className="bg-[#23252b] text-white border border-gray-600 rounded-md py-2 px-3"
//           />
//           <Button
//             size="sm"
//             className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
//             onClick={handleApplyDateFilter}
//           >
//             <Search className="w-3 h-3" />
//           </Button>
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
//               <div className={getStatusColor(order.status)}>{order.status}</div>
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

//       {/* Order Details Dialog */}
//       <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
//         <DialogContent
//           className="bg-[#23252b] text-white border-gray-600 max-w-2xl"
//         >
//           <DialogHeader>
//             <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && (
//             <div
//               ref={invoiceRef}
//               className="space-y-4 p-6 bg-white text-black rounded-lg"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <img
//                     src="/invoicelogo.jpg"
//                     alt="BDM Logo"
//                     className="h-12"
//                   />
//                 </div>
//                 <h2 className="text-2xl font-bold">
//                   {selectedOrder.invoiceNumber}
//                 </h2>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <div>
//                   <p>
//                     <strong>Bill from:</strong>
//                   </p>
//                   <p>Bangladesh Medicine (BDM)</p>
//                   <p>Wholesale Supplier</p>
//                 </div>
//                 <div>
//                   <p>
//                     <strong>Bill to:</strong>
//                   </p>
//                   <p>
//                     <strong>Customer Name:</strong> {selectedOrder.name || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Shop Name:</strong> {selectedOrder.shopName}
//                   </p>
//                   <p>
//                     <strong>Address:</strong>{" "}
//                     {selectedOrder.shippingAddress || "N/A"}
//                   </p>
//                 </div>
//                 <div>
//                   <p>
//                     <strong>Date:</strong> {selectedOrder.date}
//                   </p>
//                 </div>
//               </div>
//               <table className="w-full mt-4 border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="border p-2">Item</th>
//                     <th className="border p-2">MRP</th>
//                     <th className="border p-2">Rate</th>
//                     <th className="border p-2">Quantity</th>
//                     <th className="border p-2">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedOrder.items?.map((item, idx) => (
//                     <tr key={idx} className="border-t">
//                       <td className="border p-2">
//                         {item.product_name || `Product ID: ${item.product}`}
//                       </td>
//                       <td className="border p-2">{item?.mrp}</td>
//                       <td className="border p-2">
//                         {item.selling_price || "N/A"}
//                       </td>
//                       <td className="border p-2">{item.quantity}</td>
//                       <td className="border p-2">
//                         {item.items_total
//                           ? item.items_total.toFixed(2)
//                           : "N/A"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="mt-2">
//                 <ul className="divide-y divide-gray-200 p-4 w-full flex flex-col justify-end">
//                   <li className="flex justify-between py-2">
//                     <span className="text-gray-600 font-medium">Subtotal</span>
//                     <span className="text-gray-800">
//                       {selectedOrder.total_amount?.toFixed(2) || "N/A"}
//                     </span>
//                   </li>
//                   <li className="flex justify-between py-2">
//                     <span className="text-gray-600 font-medium">
//                       Delivery Charge
//                     </span>
//                     <span className="text-gray-800">
//                       {selectedOrder.delivery_charge?.toFixed(2) || "N/A"}
//                     </span>
//                   </li>
//                   <li className="flex justify-between py-2 font-semibold text-lg">
//                     <span className="text-gray-900">Total</span>
//                     <span className="text-green-600">{selectedOrder.amount}</span>
//                   </li>
//                 </ul>
//               </div>
//               <p className="mt-2 text-[8px]">
//                 <strong>Terms & Conditions:</strong> <br />
//                 # BDM আপনাদের সঠিক সময়ে পণ্য ডেলিভারি দিতে প্রতিশ্রুতিবদ্ধ, তাই যত
//                 দ্রুত সম্ভব দয়া করে ডেলিভারি ভাইকে ছেড়ে দিবেন। <br />
//                 # অডারকৃত পণ্য ফেরৎ দিলে ডিসকাউন্ট প্রযোজ্য নহে। সর্বোচ্চ ২৫% পণ্য
//                 ফেরৎ প্রযোজ্য। <br />
//                 # BDM সিস্টেমে বকেয়া রেখে পণ্য বিক্রির ব্যবস্থা নেই। তাই এমন
//                 বিব্রতকর প্রস্তাব না দেবার জন্য বিশেষভাবে অনুরোধ করছি। <br />
//                 # সকাল ১০টার আগে অডার পাঠিয়ে দিবেন। শুক্রবার ডেলিভারি কার্যক্রম
//                 বন্ধ থাকিবে।
//               </p>
//             </div>
//           )}
//           <DialogFooter className="mt-4">
//             <Button
//               className="bg-gray-700 hover:bg-gray-600 mr-2"
//               onClick={() => selectedOrder && handleDownloadInvoice(selectedOrder)}
//             >
//               Download Invoice (PDF)
//             </Button>
//             <DialogClose asChild>
//               <Button className="bg-gray-700 hover:bg-gray-600">Close</Button>
//             </DialogClose>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Update Order Status Dialog */}
//       <Dialog open={!!statusOrder} onOpenChange={() => setStatusOrder(null)}>
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-xl">
//           <DialogHeader>
//             <DialogTitle>Update Order Status - ID: {statusOrder?.id}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label className="text-sm text-gray-400">Select New Status</Label>
//               <Select
//                 value={newStatus}
//                 onValueChange={(value: "pending" | "delivered" | "shipped" | "cancelled") =>
//                   setNewStatus(value)
//                 }
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
//                   <SelectItem value="cancelled" className="text-gray-400">
//                     Cancelled
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label className="text-sm text-gray-400">Order Items</Label>
//               {items.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-2 mt-2"
//                 >
//                   <div>
//                     <Label className="text-sm text-white">Product</Label>
//                     <Input
//                       type="number"
//                       placeholder="Product ID"
//                       value={item.product}
//                       onChange={(e) =>
//                         handleUpdateItem(index, "product", parseInt(e.target.value))
//                       }
//                       className="bg-[#2c2e33] border-gray-600 text-white"
//                     />
//                   </div>
//                   <div>
//                     <Label className="text-sm text-white">Quantity</Label>
//                     <Input
//                       type="number"
//                       placeholder="Quantity"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleUpdateItem(index, "quantity", parseInt(e.target.value))
//                       }
//                       className="bg-[#2c2e33] border-gray-600 text-white"
//                     />
//                   </div>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleRemoveItem(index)}
//                     className="mt-6"
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               ))}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleAddItem}
//                 className="mt-2 text-black"
//               >
//                 Add Item
//               </Button>
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
//                 disabled={!newStatus || items.some((item) => !item.product || !item.quantity)}
//               >
//                 Update Order
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={!!deleteConfirmOrder}
//         onOpenChange={() => setDeleteConfirmOrder(null)}
//       >
//         <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete Order</DialogTitle>
//             <DialogDescription className="text-gray-400">
//               Are you sure you want to delete order {deleteConfirmOrder?.id}? This
//               action cannot be undone.
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
//                   const orderId = parseInt(
//                     deleteConfirmOrder.id.replace(/^#/, "")
//                   );
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

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Check, Info, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAllOrdersQuery, useDeleteOrderMutation, useFilterOrdersQuery, usePendingProductsQuery, useUpdateOrdersMutation } from '@/redux/feature/orderSlice';
import { useAreaListQuery } from '@/redux/feature/areaSlice';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

// Define interfaces
interface OrderItem {
  product: number;
  quantity: number;
  product_name?: string;
  selling_price?: string;
  items_total?: number;
}

interface Order {
  id: string;
  date: string;
  customerName: string;
  shopName: string;
  invoiceNumber: string;
  amount: string;
  status: 'pending' | 'delivered' | 'shipped' | 'cancelled';
  shippingAddress?: string;
  items?: OrderItem[];
  name?: string;
  delivery_charge?: number;
  total_amount?: number;
}

interface OrderUpdateFormValues {
  order_status: 'pending' | 'delivered' | 'shipped' | 'cancelled';
  items: OrderItem[];
}

interface Area {
  area_id: number;
  area_name: string;
  is_active: boolean;
}

// Helper functions
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const formatDateTimeForAPI = (date: Date | null, time: string | null) => {
  if (!date) return undefined;
  const dateStr = date.toISOString().split('T')[0];
  return time ? `${dateStr}T${time}:00` : `${dateStr}T00:00:00`;
};

const mapApiToOrders = (apiData: any[]): Order[] =>
  apiData.map((order) => ({
    id: `#${order.order_id}`,
    date: formatDate(order.order_date),
    customerName: order.user_id ? `User-${order.user_id}` : 'Unknown',
    shopName: order.shop_name,
    amount: `৳${order.final_amount?.toFixed(2) || '0.00'}`,
    status: (order.order_status?.toLowerCase() || 'pending') as 'pending' | 'delivered' | 'shipped' | 'cancelled',
    shippingAddress: order.shipping_address,
    items: order.items || [],
    name: order.full_name,
    invoiceNumber: order.invoice_number,
    delivery_charge: order.delivery_charge,
    total_amount: order.total_amount,
    invoice_number:order.invoice_number,
    full_name:order.full_name
  }));

const getStatusColor = (status: string) =>
({
  pending: 'text-red-400',
  delivered: 'text-green-400',
  shipped: 'text-blue-400',
  cancelled: 'text-gray-400',
  default: 'text-gray-400',
}[status.toLowerCase()] || 'text-gray-400');

export default function Component() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<'pending' | 'delivered' | 'shipped' | 'cancelled' | ''>('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    startTime: string | null;
    endTime: string | null;
    areaId: number | null;
  }>({
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    areaId: null,
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 7;

  // Query hooks
  const {
    data: allOrdersData,
    isLoading: allOrdersLoading,
    isError: allOrdersError,
    refetch: refetchAllOrders,
  } = useAllOrdersQuery({
    page,
    pageSize: itemsPerPage,
    date: filters.startDate ? formatDateTimeForAPI(filters.startDate, null) : undefined,
  }, { skip: activeTab !== 'all' || isFilterApplied });
  console.log(allOrdersData, "allOrdersData");

  const {
    data: pendingData,
    isLoading: pendingLoading,
    isError: pendingError,
    refetch: refetchPendingOrders,
  } = usePendingProductsQuery({
    page,
    pageSize: itemsPerPage,
    date: filters.startDate ? formatDateTimeForAPI(filters.startDate, null) : undefined,
  }, { skip: activeTab !== 'pending' || isFilterApplied });

  const { data: areaData } = useAreaListQuery(undefined);

  const {
    data: filterData,
    isLoading: filterLoading,
    isError: filterError,
    refetch: refetchFilterOrders,
  } = useFilterOrdersQuery({
    from_datetime: filters.startDate && filters.startTime ? formatDateTimeForAPI(filters.startDate, filters.startTime) : undefined,
    to_datetime: filters.endDate && filters.endTime ? formatDateTimeForAPI(filters.endDate, filters.endTime) : undefined,
    area: filters.areaId ?? undefined,
  }, { skip: !isFilterApplied || !filters.startDate || !filters.endDate });

  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrders] = useUpdateOrdersMutation();

  // Debounced refetch
  const debouncedRefetch = useCallback(
    debounce(() => {
      if (isFilterApplied) {
        refetchFilterOrders();
      } else if (activeTab === 'all') {
        refetchAllOrders();
      } else {
        refetchPendingOrders();
      }
    }, 500),
    [activeTab, isFilterApplied, refetchAllOrders, refetchPendingOrders, refetchFilterOrders]
  );

  // Update orders based on active tab and filter
  useEffect(() => {
    if (isFilterApplied && filterData?.results?.data) {
      setOrders(mapApiToOrders(filterData.results.data));
      setTotalOrders(filterData.count || 0);
    } else if (activeTab === 'all' && allOrdersData?.results?.data) {
      setOrders(mapApiToOrders(allOrdersData.results.data));
      setTotalOrders(allOrdersData.count || 0);
    } else if (activeTab === 'pending' && pendingData?.data) {
      setOrders(mapApiToOrders(pendingData.data));
      setTotalOrders(pendingData.total || 0);
    } else {
      setOrders([]);
      setTotalOrders(0);
    }
  }, [activeTab, allOrdersData, pendingData, filterData, isFilterApplied]);

  // Reset page and refetch when tab or filters change
  useEffect(() => {
    setPage(1);
    debouncedRefetch();
  }, [activeTab, isFilterApplied, filters, debouncedRefetch]);

  // Set default status and items for update dialog
  useEffect(() => {
    if (statusOrder) {
      setNewStatus(statusOrder.status || 'delivered');
      setItems(statusOrder.items?.length ? statusOrder.items : [{ product: 0, quantity: 1 }]);
    } else {
      setNewStatus('');
      setItems([]);
    }
  }, [statusOrder]);

  const handleAction = useCallback(
    (orderIndex: number, action: 'approve' | 'info' | 'delete' | 'download') => {
      const order = orders[orderIndex];
      switch (action) {
        case 'approve':
          setStatusOrder(order);
          break;
        case 'info':
          setSelectedOrder(order);
          break;
        case 'delete':
          setDeleteConfirmOrder(order);
          break;
        case 'download':
          handleDownloadInvoice(order);
          break;
      }
    },
    [orders]
  );

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteOrder(id).unwrap();
      toast.success('Order deleted successfully!', { position: 'top-right' });
      setDeleteConfirmOrder(null);
      debouncedRefetch();
    } catch {
      toast.error('Failed to delete order!', { position: 'top-right' });
    }
  }, [deleteOrder, debouncedRefetch]);

  const handleUpdateStatus = useCallback(async () => {
    if (!statusOrder || !newStatus) return;
    const orderId = parseInt(statusOrder.id.replace(/^#/, ''));
    if (isNaN(orderId)) {
      toast.error('Invalid order ID!', { position: 'top-right' });
      return;
    }
    try {
      const updateData: OrderUpdateFormValues = {
        order_status: newStatus,
        items: items.map(({ product, quantity }) => ({ product, quantity })),
      };
      await updateOrders({ id: orderId, data: updateData }).unwrap();
      toast.success('Order updated successfully!', { position: 'top-right' });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === statusOrder.id ? { ...order, status: newStatus, items } : order
        )
      );
      setStatusOrder(null);
      setNewStatus('');
      setItems([]);
      debouncedRefetch();
    } catch {
      toast.error('Failed to update order!', { position: 'top-right' });
    }
  }, [statusOrder, newStatus, items, updateOrders, debouncedRefetch]);

  const handleAddItem = useCallback(() => {
    setItems((prev) => [...prev, { product: 0, quantity: 1 }]);
  }, []);

  const handleUpdateItem = useCallback((index: number, field: 'product' | 'quantity', value: number) => {
    setItems((prev) => {
      const updatedItems = [...prev];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return updatedItems;
    });
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      areaId: null,
    });
    setIsFilterApplied(false);
  }, []);

  const handleApplyFilters = useCallback(() => {
    if (filters.startDate && filters.endDate) {
      setIsFilterApplied(true);
      debouncedRefetch();
    } else {
      toast.error('Please select both start and end dates!', { position: 'top-right' });
    }
  }, [filters, debouncedRefetch]);

  const handleDownloadInvoice = useCallback(
    (order: Order) => {
      if (invoiceRef.current && order) {
        html2canvas(invoiceRef.current, { scale: 2, useCORS: true })
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a5',
            });

            const imgWidth = 128;
            const pageHeight = 200;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 5;

            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
              position = heightLeft - imgHeight + 10;
              pdf.addPage();
              pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            pdf.save(`invoice_${order.id.replace('#', '')}.pdf`);
          })
          .catch((error) => {
            console.error('Error generating invoice PDF:', error);
            toast.error('Failed to generate invoice PDF!', { position: 'top-right' });
          });
      } else {
        toast.error('Invoice content not found!', { position: 'top-right' });
      }
    },
    []
  );

  const renderPagination = useCallback(() => {
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
              variant={page === pageNum ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className={page === pageNum ? 'bg-green-500 hover:bg-green-600 text-white' : 'text-white hover:bg-gray-700'}
            >
              {pageNum}
            </Button>
          );
        })}
        {totalPages > 5 && page + 2 < totalPages && (
          <>
            <span className="text-gray-400 px-2">...</span>
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
  }, [page, totalOrders, handlePageChange]);

  const isLoading = isFilterApplied ? filterLoading : activeTab === 'all' ? allOrdersLoading : pendingLoading;
  const isError = isFilterApplied ? filterError : activeTab === 'all' ? allOrdersError : pendingError;

  return (
    <div className="text-white pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* SVG content unchanged */}
            </svg>
            <h1 className="text-xl font-medium text-white">
              {activeTab === 'pending' ? `You have ${pendingData?.total || 0} pending orders` : `Total orders: ${totalOrders}`}
            </h1>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'pending')} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4 mb-6">
        {/* <Label className="text-sm text-gray-400">Filter Orders</Label> */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className='flex flex-col'>
                <Label className="text-sm text-gray-400">Start Date & Time</Label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start date"
                  className="bg-[#23252b] text-white border border-gray-600 rounded-md py-2 px-3 w-[180px]"
                />
              </div>
              <Input
                type="time"
                value={filters.startTime || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, startTime: e.target.value }))}
                className="bg-[#23252b] text-white border border-gray-600 rounded-md py-2 px-3 mt-1 w-[180px]"
              />
            </div>
            <div className='flex flex-col'>
              <div className='flex flex-col'>
                <Label className="text-sm text-gray-400">End Date & Time</Label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End date"
                  className="bg-[#23252b] text-white border border-gray-600 rounded-md py-2 px-3 w-[180px]"
                />  
              </div>
              <Input
                type="time"
                value={filters.endTime || ''}
                onChange={(e) => setFilters((prev) => ({ ...prev, endTime: e.target.value }))}
                className="bg-[#23252b] text-white border border-gray-600 rounded-md py-2 px-3 mt-1 w-[180px]"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400">Area</Label>
              <Select
                value={filters.areaId?.toString() || ''}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, areaId: value ? parseInt(value) : null }))}
              >
                <SelectTrigger className="w-[180px] bg-[#23252b] border-gray-600">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-gray-600">
                  <SelectGroup>
                    {/* <SelectLabel>Areas</SelectLabel> */}
                    {areaData?.data?.map((area: Area) => (
                      <SelectItem className="text-white" key={area.area_id} value={area.area_id.toString()}>
                        {area.area_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
              onClick={handleApplyFilters}
              disabled={!filters.startDate || !filters.endDate}
            >
              <Search className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-black border-gray-600"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {isLoading && <div className="text-white">Loading...</div>}
      {isError && <div className="text-red-400">Error loading orders</div>}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-gray-400">No orders found</div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="bg-[#23252b] rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-600 text-sm bg-[#2c2e33] font-medium text-gray-300">
            <div>Invoice Number</div>
            <div>Date</div>
            <div>Customer Name</div>
            <div>Shop Name</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          <div className="divide-y divide-gray-600">
            {orders.map((order, index) => (
              <div key={order.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors">
                <div className="text-white font-medium">{order.invoice_number}</div>
                <div className="text-gray-300">{order.date}</div>
                <div className="text-white">{order.full_name}</div>
                <div className="text-gray-300">{order.shopName}</div>
                <div className="text-white font-medium">{order.amount}</div>
                <div className={getStatusColor(order.status)}>{order.status}</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(index, 'approve')}
                    className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600 rounded-full"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(index, 'info')}
                    className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(index, 'delete')}
                    className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - ID: {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div ref={invoiceRef} className="space-y-4 p-2 bg-white text-black rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <img src="/invoicelogo.jpg" alt="BDM Logo" className="h-12" />
                </div>
                <h2 className="text-2xl font-bold">{selectedOrder.invoiceNumber}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p><strong>Bill from:</strong></p>
                  <p>Bangladesh Medicine (BDM)</p>
                  <p>Wholesale Supplier</p>
                </div>
                <div>
                  <p><strong>Bill to:</strong></p>
                  <p><strong>Customer Name:</strong> {selectedOrder.name || 'N/A'}</p>
                  <p><strong>Shop Name:</strong> {selectedOrder.shopName}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Date:</strong> {selectedOrder.date}</p>
                </div>
              </div>
              <table className="w-full mt-2 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Item</th>
                    <th className="border p-2">MRP</th>
                    <th className="border p-2">Rate</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="border p-2">{item.product_name || `Product ID: ${item.product}`}</td>
                      <td className="border p-2">{item?.mrp ?? 'N/A'}</td>
                      <td className="border p-2">{item.selling_price || 'N/A'}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.items_total ? item.items_total.toFixed(2) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2">
                <ul className="divide-y divide-gray-200 p-4 w-full flex flex-col justify-end">
                  <li className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-gray-800">{selectedOrder.total_amount?.toFixed(2) || 'N/A'}</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">Delivery Charge</span>
                    <span className="text-gray-800">{selectedOrder.delivery_charge?.toFixed(2) || 'N/A'}</span>
                  </li>
                  <li className="flex justify-between py-2 font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600">{selectedOrder.amount}</span>
                  </li>
                </ul>
              </div>
              <p className="mt-2 text-[8px]">
                <strong>Terms & Conditions:</strong> <br />
                # BDM আপনাদের সঠিক সময়ে পণ্য ডেলিভারি দিতে প্রতিশ্রুতিবদ্ধ, তাই যত দ্রুত সম্ভব দয়া করে ডেলিভারি ভাইকে ছেড়ে দিবেন। <br />
                # অডারকৃত পণ্য ফেরৎ দিলে ডিসকাউন্ট প্রযোজ্য নহে। সর্বোচ্চ ২৫% পণ্য ফেরৎ প্রযোজ্য। <br />
                # BDM সিস্টেমে বকেয়া রেখে পণ্য বিক্রির ব্যবস্থা নেই। তাই এমন বিব্রতকর প্রস্তাব না দেবার জন্য বিশেষভাবে অনুরোধ করছি। <br />
                # সকাল ১০টার আগে অডার পাঠিয়ে দিবেন। শুক্রবার ডেলিভারি কার্যক্রম বন্ধ থাকিবে।
              </p>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button className="bg-gray-700 hover:bg-gray-600 mr-2" onClick={() => selectedOrder && handleDownloadInvoice(selectedOrder)}>
              Download Invoice (PDF)
            </Button>
            <DialogClose asChild>
              <Button className="bg-gray-700 hover:bg-gray-600">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Order Status Dialog */}
      <Dialog open={!!statusOrder} onOpenChange={() => setStatusOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-xl">
          <DialogHeader>
            <DialogTitle>Update Order Status - ID: {statusOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-400">Select New Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value: 'pending' | 'delivered' | 'shipped' | 'cancelled') => setNewStatus(value)}
              >
                <SelectTrigger className="w-full bg-[#2c2e33] border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-gray-600">
                  <SelectItem value="pending" className="text-red-400">Pending</SelectItem>
                  <SelectItem value="delivered" className="text-green-400">Delivered</SelectItem>
                  <SelectItem value="shipped" className="text-blue-400">Shipped</SelectItem>
                  <SelectItem value="cancelled" className="text-gray-400">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-gray-400">Order Items</Label>
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <div>
                    <Label className="text-sm text-white">Product</Label>
                    <Input
                      type="number"
                      placeholder="Product ID"
                      value={item.product}
                      onChange={(e) => handleUpdateItem(index, 'product', parseInt(e.target.value))}
                      className="bg-[#2c2e33] border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-white">Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
                      className="bg-[#2c2e33] border-gray-600 text-white"
                    />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(index)} className="mt-6">
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-2 text-black">
                Add Item
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setStatusOrder(null)} className="bg-gray-700 hover:bg-gray-600">
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                className="bg-green-500 hover:bg-green-600"
                disabled={!newStatus || items.some((item) => !item.product || !item.quantity)}
              >
                Update Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmOrder} onOpenChange={() => setDeleteConfirmOrder(null)}>
        <DialogContent className="bg-[#23252b] text-white border-gray-600 max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete order {deleteConfirmOrder?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirmOrder(null)} className="bg-gray-700 hover:bg-gray-600">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deleteConfirmOrder) {
                  const orderId = parseInt(deleteConfirmOrder.id.replace(/^#/, ''));
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

      {orders.length > 0 && renderPagination()}
    </div>
  );
}