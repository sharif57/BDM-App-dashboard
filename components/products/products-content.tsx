

// "use client";

// import { useState, useEffect } from "react";
// import { Plus, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import Link from "next/link";
// import { 
//   useAllProductsQuery, 
//   useDeleteProductMutation, 
//   useUpdateProductMutation
// } from "@/redux/feature/productSlice";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import { useAllGenericsQuery } from "@/redux/feature/genericSlice";
// import { useAllCategoriesQuery } from "@/redux/feature/categorieSlice";
// import { useAllCompaniesQuery } from "@/redux/feature/companySlice";

// interface Product {
//   product_id: number;
//   product_name: string;
//   generic_name: string;
//   product_description: string;
//   product_image: string;
//   sku: string;
//   quantity_per_box: number;
//   company_id: number;
//   company_name: string;
//   category_id: number[];
//   category_name: string[];
//   stock_quantity: number;
//   cost_price: string;
//   mrp: string;
//   selling_price: string;
//   discount_percent: number;
//   out_of_stock: boolean;
//   is_active: boolean;
//   created_on: string;
//   updated_on: string;
// }

// const productFormSchema = z.object({
//   product_name: z.string().min(1, "Product name is required"),
//   generic_name: z.string().min(1, "Generic name is required"),
//   product_description: z.string().optional(),
//   sku: z.string().min(1, "SKU is required"),
//   quantity_per_box: z.number().min(1, "Quantity must be at least 1"),
//   stock_quantity: z.number().min(0, "Stock cannot be negative"),
//   cost_price: z.string().min(1, "Cost price is required"),
//   mrp: z.string().min(1, "MRP is required"),
//   selling_price: z.string().min(1, "Selling price is required"),
//   discount_percent: z.number().min(0, "Discount cannot be negative"),
//   is_active: z.boolean(),
// });

// type ProductFormValues = z.infer<typeof productFormSchema>;

// export default function ProductsContent() {
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(1000);
//   const { data: apiData, isLoading, isError, refetch } = useAllProductsQuery(pageSize);
//   const [deleteProduct] = useDeleteProductMutation();
//   const [updateProduct] = useUpdateProductMutation();

//     const { data: generics } = useAllGenericsQuery(undefined);
//     console.log("Generics:", generics);
//     const { data } = useAllCategoriesQuery(undefined);
//     console.log("Categories:", data);
//     const { data: companies } = useAllCompaniesQuery(undefined);
//     console.log("Companies:", companies);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const IMAGE = 'https://mehedidev.net'

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productFormSchema),
//     defaultValues: {
//       product_name: "",
//       generic_name: "",
//       product_description: "",
//       sku: "",
//       quantity_per_box: 0,
//       stock_quantity: 0,
//       cost_price: "",
//       mrp: "",
//       selling_price: "",
//       discount_percent: 0,
//       is_active: true,
//     },
//   });

//   // Process API data when loaded
//   useEffect(() => {
//     if (apiData?.results?.data) {
//       const productsData = apiData.results.data;
//       setProducts(productsData);
//       setTotalProducts(apiData.results.total_products || 0);

//       // Extract unique categories
//       const uniqueCategories = new Set<string>();
//       uniqueCategories.add("All");
//       productsData.forEach((product: Product) => {
//         product.category_name.forEach((cat) => uniqueCategories.add(cat));
//       });
//       setCategories(Array.from(uniqueCategories));
//     }
//   }, [apiData]);

//   // Filter products based on category and search term
//   const filteredProducts = products.filter((product) => {
//     const matchesCategory = 
//       selectedCategory === "All" || 
//       product.category_name.includes(selectedCategory);
//     const matchesSearch = 
//       product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product?.generic_name?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const getStatus = (product: Product) => {
//     if (product.out_of_stock) return "Out of Stock";
//     if (product.stock_quantity < 10) return "Low Stock";
//     return "Active";
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-500/20 text-green-400";
//       case "Low Stock":
//         return "bg-yellow-500/20 text-yellow-400";
//       case "Out of Stock":
//         return "bg-red-500/20 text-red-400";
//       default:
//         return "bg-gray-500/20 text-gray-400";
//     }
//   };

//   const handleView = (productId: number) => {
//     const product = products.find(p => p.product_id === productId);
//     if (product) {
//       setSelectedProduct(product);
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setSelectedProduct(product);
//     form.reset({
//       product_name: product.product_name,
//       generic_name: product.generic_name,
//       product_description: product.product_description,
//       sku: product.sku,
//       quantity_per_box: product.quantity_per_box,
//       stock_quantity: product.stock_quantity,
//       cost_price: product.cost_price,
//       mrp: product.mrp,
//       selling_price: product.selling_price,
//       discount_percent: product.discount_percent,
//       is_active: product.is_active,
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = (product: Product) => {
//     setSelectedProduct(product);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedProduct) return;
    
//     try {
//       await deleteProduct(selectedProduct.product_id).unwrap();
//       toast.success("Product deleted successfully");
//       refetch();
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       toast.error( "Failed to delete product");
//     }
//   };

//   const onSubmit = async (data: ProductFormValues) => {
//     if (!selectedProduct) return;
    
//     try {
//       const formData = new FormData();
//       formData.append("product_name", data.product_name);
//       formData.append("generic_name", data.generic_name);
//       formData.append("product_description", data.product_description || "");
//       formData.append("sku", data.sku);
//       formData.append("quantity_per_box", data.quantity_per_box.toString());
//       formData.append("stock_quantity", data.stock_quantity.toString());
//       formData.append("cost_price", data.cost_price);
//       formData.append("mrp", data.mrp);
//       formData.append("selling_price", data.selling_price);
//       formData.append("discount_percent", data.discount_percent.toString());
//       formData.append("is_active", data.is_active.toString());

//       await updateProduct({
//         id: selectedProduct.product_id,
//         data: formData,
//       }).unwrap();

//       toast.success("Product updated successfully");
//       refetch();
//       setIsEditModalOpen(false);
//     } catch (error) {
//       toast.error( "Failed to update product");
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   if (isLoading) return <div className="text-white p-6">Loading...</div>;
//   if (isError) return <div className="text-red-400 p-6">Error loading products</div>;

//   return (
//     <div className="p-3 sm:p-4 lg:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
//           <p className="text-sm text-gray-400">
//             Total Products: {totalProducts}
//           </p>
//         </div>
//         <Link href="/products/add-product">
//           <Button className="bg-[#44B46E] hover:bg-[#44B46E] rounded-full">
//             <Plus className="w-4 h-4 mr-2" />
//             Add Product
//           </Button>
//         </Link>
//       </div>

//       {/* Filters */}
//       <Card className="bg-gray-800 border-gray-700 mb-6">
//         <CardContent className="p-4">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex gap-2 flex-wrap">
//               {categories.map((category) => (
//                 <Button
//                   key={category}
//                   variant={selectedCategory === category ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => {
//                     setSelectedCategory(category);
//                   }}
//                   className={
//                     selectedCategory === category
//                       ? "bg-blue-600 hover:bg-blue-700"
//                       : "text-gray-400 hover:text-white"
//                   }
//                 >
//                   {category}
//                 </Button>
//               ))}
//             </div>
//             <div className="relative">
//               <Input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                 }}
//                 className="bg-gray-700 border-gray-600 text-white pl-10 w-full lg:w-64"
//               />
//               <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Products Table */}
//       <Card className="bg-gray-800 border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-white">Product List</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {filteredProducts.length === 0 ? (
//             <div className="text-center text-gray-400 py-6">
//               No products found.
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full" role="grid">
//                   <thead>
//                     <tr className="border-b border-gray-700">
//                       <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                         Product
//                       </th>
//                       <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                         Category
//                       </th>
//                       <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                         Price
//                       </th>
//                       <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                         Stock
//                       </th>
//                       <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                         Status
//                       </th>
//                       <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredProducts.map((product) => (
//                       <tr
//                         key={product.product_id}
//                         className="border-b border-gray-700 hover:bg-gray-700/50"
//                       >
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={`${IMAGE}${product.product_image}`}
//                               alt={product.product_name}
//                               className="w-10 h-10 rounded"
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40";
//                               }}
//                             />
//                             <div>
//                               <div className="text-white font-medium">{product.product_name}</div>
//                               <div className="text-gray-400 text-sm">{product.generic_name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4 text-gray-300">
//                           {product.category_name.join(", ")}
//                         </td>
//                         <td className="py-3 px-4 text-white font-medium">
//                           ৳{product.selling_price}
//                         </td>
//                         <td className="py-3 px-4 text-gray-300">{product.stock_quantity}</td>
//                         <td className="py-3 px-4">
//                           <Badge className={getStatusColor(getStatus(product))}>
//                             {getStatus(product)}
//                           </Badge>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
//                               onClick={() => handleView(product.product_id)}
//                               aria-label={`View product ${product.product_name}`}
//                             >
//                               <Eye className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="p-1 h-8 w-8 text-gray-400 hover:text-green-400"
//                               onClick={() => handleEdit(product)}
//                               aria-label={`Edit product ${product.product_name}`}
//                             >
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="p-1 h-8 w-8 text-gray-400 hover:text-red-400"
//                               onClick={() => handleDelete(product)}
//                               aria-label={`Delete product ${product.product_name}`}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="flex items-center justify-between mt-4">
//                 <div className="text-sm text-gray-400">
//                   Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalProducts)} of {totalProducts} products
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handlePageChange(Math.max(1, page - 1))}
//                     disabled={page === 1}
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page * pageSize >= totalProducts}
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* View Product Modal */}
//       <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
//         <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
//           <DialogHeader>
//             <DialogTitle>Product Details - ID: {selectedProduct?.product_id}</DialogTitle>
//           </DialogHeader>
//           {selectedProduct && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <img
//                   // src={selectedProduct.product_image}
//                   src={`${IMAGE}${selectedProduct?.product_image}`}
//                   alt={selectedProduct.product_name}
//                   className="w-20 h-20 rounded"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80";
//                   }}
//                 />
//                 <div>
//                   <h3 className="text-lg font-medium">{selectedProduct.product_name}</h3>
//                   <p className="text-sm text-gray-400">{selectedProduct.generic_name}</p>
//                   <p className="text-sm text-gray-400">SKU: {selectedProduct.sku}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-400">Category</p>
//                   <p>{selectedProduct.category_name.join(", ")}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Company</p>
//                   <p>{selectedProduct.company_name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">MRP</p>
//                   <p>৳{selectedProduct.mrp}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Selling Price</p>
//                   <p>৳{selectedProduct.selling_price}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Discount</p>
//                   <p>{selectedProduct.discount_percent}% (৳{(parseFloat(selectedProduct.mrp) - parseFloat(selectedProduct.selling_price)).toFixed(2)})</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Cost Price</p>
//                   <p>৳{selectedProduct.cost_price}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Stock</p>
//                   <p>{selectedProduct.stock_quantity}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Status</p>
//                   <Badge className={getStatusColor(getStatus(selectedProduct))}>
//                     {getStatus(selectedProduct)}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Created On</p>
//                   <p>{new Date(selectedProduct.created_on).toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Updated On</p>
//                   <p>{new Date(selectedProduct.updated_on).toLocaleString()}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="text-sm text-gray-400">Description</p>
//                   <p>{selectedProduct.product_description || "No description available"}</p>
//                 </div>
//               </div>
//               <DialogClose asChild>
//                 <Button className="mt-4 bg-gray-700 hover:bg-gray-600">
//                   Close
//                 </Button>
//               </DialogClose>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Edit Product Modal */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
//           <DialogHeader>
//             <DialogTitle>Edit Product - ID: {selectedProduct?.product_id}</DialogTitle>
//           </DialogHeader>
//           {selectedProduct && (
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="product_name">Product Name</Label>
//                   <Input
//                     id="product_name"
//                     {...form.register("product_name")}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.product_name && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.product_name.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="generic_name">Generic Name</Label>
//                   <Input
//                     id="generic_name"
//                     {...form.register("generic_name")}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.generic_name && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.generic_name.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="sku">SKU</Label>
//                   <Input
//                   disabled
//                     id="sku"
//                     {...form.register("sku")}
//                     className="bg-gray-700 readonly border-gray-600"
//                   />
//                   {form.formState.errors.sku && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.sku.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="quantity_per_box">Quantity per Box</Label>
//                   <Input
//                     id="quantity_per_box"
//                     type="number"
//                     {...form.register("quantity_per_box", { valueAsNumber: true })}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.quantity_per_box && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.quantity_per_box.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="stock_quantity">Stock Quantity</Label>
//                   <Input
//                     id="stock_quantity"
//                     type="number"
//                     {...form.register("stock_quantity", { valueAsNumber: true })}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.stock_quantity && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.stock_quantity.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="cost_price">Cost Price</Label>
//                   <Input
//                     id="cost_price"
//                     {...form.register("cost_price")}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.cost_price && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.cost_price.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="mrp">MRP</Label>
//                   <Input
//                     id="mrp"
//                     {...form.register("mrp")}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.mrp && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.mrp.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="selling_price">Selling Price</Label>
//                   <Input
//                     id="selling_price"
//                     {...form.register("selling_price")}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.selling_price && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.selling_price.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="discount_percent">Discount Percent</Label>
//                   <Input
//                     id="discount_percent"
//                     disabled
//                     type="number"
//                     {...form.register("discount_percent", { valueAsNumber: true })}
//                     className="bg-gray-700 border-gray-600"
//                   />
//                   {form.formState.errors.discount_percent && (
//                     <p className="text-sm text-red-400">
//                       {form.formState.errors.discount_percent.message}
//                     </p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="is_active">Status</Label>
//                   <Select
//                     onValueChange={(value) => form.setValue("is_active", value === "true")}
//                     defaultValue={selectedProduct.is_active ? "true" : "false"}
//                   >
//                     <SelectTrigger className="bg-gray-700 border-gray-600">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 border-gray-700">
//                       <SelectItem value="true">Active</SelectItem>
//                       <SelectItem value="false">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="md:col-span-2 space-y-2">
//                   <Label htmlFor="product_description">Description</Label>
//                   <Textarea
//                     id="product_description"
//                     {...form.register("product_description")}
//                     className="bg-gray-700 border-gray-600 min-h-[100px]"
//                   />
//                 </div>
//               </div>
              
//               <DialogFooter>
//                 <Button type="button" className="text-black bg-red-400" variant="outline" onClick={() => setIsEditModalOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//                   Save Changes
//                 </Button>
//               </DialogFooter>
//             </form>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Modal */}
//       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//         <DialogContent className="bg-gray-800 border-gray-700 text-white">
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <p>
//               Are you sure you want to delete{" "}
//               <span className="font-bold">{selectedProduct?.product_name}</span>?
//             </p>
//             <p className="text-sm text-gray-400">
//               This action cannot be undone.
//             </p>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" className="text-black bg-red-400" onClick={() => setIsDeleteModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={confirmDelete}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Plus, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { 
  useAllProductsQuery, 
  useDeleteProductMutation, 
  useUpdateProductMutation
} from "@/redux/feature/productSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAllGenericsQuery } from "@/redux/feature/genericSlice";
import { useAllCategoriesQuery } from "@/redux/feature/categorieSlice";
import { useAllCompaniesQuery } from "@/redux/feature/companySlice";

interface Product {
  product_id: number;
  product_name: string;
  generic_name: string;
  product_description: string;
  product_image: string;
  sku: string;
  quantity_per_box: number;
  company_id: number;
  company_name: string;
  category_id: number;
  category_name: string;
  stock_quantity: number;
  cost_price: number;
  mrp: number;
  selling_price: number;
  discount_percent: number;
  out_of_stock: boolean;
  is_active: boolean;
  created_on: string;
  updated_on: string;
}

interface Generic {
  generic_id: number;
  name: string;
  description: string;
  created_on: string;
  updated_on: string;
}

interface Company {
  company_id: number;
  company_name: string;
  logo: string | null;
  is_active: boolean;
  created_on: string;
  updated_on: string;
}

interface Category {
  category_id: number;
  name: string;
  description: string;
  created_on: string;
  updated_on: string;
}

const productFormSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  generic_id: z.number().min(1, "Generic is required"),
  product_description: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  quantity_per_box: z.number().min(1, "Quantity must be at least 1"),
  company_id: z.number().min(1, "Company is required"),
  category_id: z.number().min(1, "Category is required"),
  stock_quantity: z.number().min(0, "Stock cannot be negative"),
  cost_price: z.number().min(0, "Cost price must be positive"),
  mrp: z.number().min(0, "MRP must be positive"),
  selling_price: z.number().min(0, "Selling price must be positive"),
  discount_percent: z.number().min(0, "Discount cannot be negative"),
  is_active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductsContent() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(1000);
  const { data: apiData, isLoading, isError, refetch } = useAllProductsQuery(pageSize);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const { data: genericsData } = useAllGenericsQuery(undefined);
  const { data: categoriesData } = useAllCategoriesQuery(undefined);
  const { data: companiesData } = useAllCompaniesQuery(undefined);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const IMAGE = 'https://mehedidev.net'

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      product_name: "",
      generic_id: 0,
      product_description: "",
      sku: "",
      quantity_per_box: 0,
      company_id: 0,
      category_id: 0,
      stock_quantity: 0,
      cost_price: 0,
      mrp: 0,
      selling_price: 0,
      discount_percent: 0,
      is_active: true,
    },
  });

  // Process API data when loaded
  useEffect(() => {
    if (apiData?.results?.data) {
      // Transform the API data to use single category instead of arrays
      const productsData = apiData.results.data.map((product: any) => ({
        ...product,
        category_id: product.category_id && product.category_id.length > 0 ? product.category_id[0] : 0,
        category_name: product.category_name && product.category_name.length > 0 ? product.category_name[0] : ""
      }));
      
      setProducts(productsData);
      setTotalProducts(apiData.results.total_products || 0);

      // Extract unique categories
      const uniqueCategories = new Set<string>();
      uniqueCategories.add("All");
      productsData.forEach((product: Product) => {
        if (product.category_name) {
          uniqueCategories.add(product.category_name);
        }
      });
      setCategories(Array.from(uniqueCategories));
    }
  }, [apiData]);

  // Filter products based on category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory = 
      selectedCategory === "All" || 
      product.category_name === selectedCategory;
    const matchesSearch = 
      product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.generic_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatus = (product: Product) => {
    if (product.out_of_stock) return "Out of Stock";
    if (product.stock_quantity < 10) return "Low Stock";
    return "Active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400";
      case "Low Stock":
        return "bg-yellow-500/20 text-yellow-400";
      case "Out of Stock":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleView = (productId: number) => {
    const product = products.find(p => p.product_id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    
    // Find generic ID by name
    const genericId = genericsData?.data?.find(
      (g: Generic) => g.name === product.generic_name
    )?.generic_id || 0;
    
    form.reset({
      product_name: product.product_name,
      generic_id: genericId,
      product_description: product.product_description,
      sku: product.sku,
      quantity_per_box: product.quantity_per_box,
      company_id: product.company_id,
      category_id: product.category_id,
      stock_quantity: product.stock_quantity,
      cost_price: product.cost_price,
      mrp: product.mrp,
      selling_price: product.selling_price,
      discount_percent: product.discount_percent,
      is_active: product.is_active,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.product_id).unwrap();
      toast.success("Product deleted successfully");
      refetch();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error( "Failed to delete product");
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!selectedProduct) return;
    
    try {
      const formData = new FormData();
      formData.append("product_name", data.product_name);
      formData.append("generic_name", data.generic_id.toString());
      formData.append("product_description", data.product_description || "");
      formData.append("sku", data.sku);
      formData.append("quantity_per_box", data.quantity_per_box.toString());
      formData.append("company_id", data.company_id.toString());
      formData.append("category_id", JSON.stringify(data.category_id));
      formData.append("stock_quantity", data.stock_quantity.toString());
      formData.append("cost_price", data.cost_price.toString());
      formData.append("mrp", data.mrp.toString());
      formData.append("selling_price", data.selling_price.toString());
      formData.append("discount_percent", data.discount_percent.toString());
      formData.append("is_active", data.is_active.toString());

      await updateProduct({
        id: selectedProduct.product_id,
        data: formData,
      }).unwrap();

      toast.success("Product updated successfully");
      refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error( "Failed to update product");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (isError) return <div className="text-red-400 p-6">Error loading products</div>;

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
          <p className="text-sm text-gray-400">
            Total Products: {totalProducts}
          </p>
        </div>
        <Link href="/products/add-product">
          <Button className="bg-[#44B46E] hover:bg-[#44B46E] rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                  className={
                    selectedCategory === category
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "text-gray-400 hover:text-black"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="bg-gray-700 border-gray-600 text-white pl-10 w-full lg:w-64"
              />
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              No products found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full" role="grid">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.product_id}
                        className="border-b border-gray-700 hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={`${IMAGE}${product.product_image}`}
                              alt={product.product_name}
                              className="w-10 h-10 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40";
                              }}
                            />
                            <div>
                              <div className="text-white font-medium">{product.product_name}</div>
                              <div className="text-gray-400 text-sm">{product.generic_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {product.category_name}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">
                          ৳{product.selling_price}
                        </td>
                        <td className="py-3 px-4 text-gray-300">{product.stock_quantity}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(getStatus(product))}>
                            {getStatus(product)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
                              onClick={() => handleView(product.product_id)}
                              aria-label={`View product ${product.product_name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-gray-400 hover:text-green-400"
                              onClick={() => handleEdit(product)}
                              aria-label={`Edit product ${product.product_name}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-gray-400 hover:text-red-400"
                              onClick={() => handleDelete(product)}
                              aria-label={`Delete product ${product.product_name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalProducts)} of {totalProducts} products
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page * pageSize >= totalProducts}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Product Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
          <DialogHeader>
            <DialogTitle>Product Details - ID: {selectedProduct?.product_id}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={`${IMAGE}${selectedProduct?.product_image}`}
                  alt={selectedProduct.product_name}
                  className="w-20 h-20 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80";
                  }}
                />
                <div>
                  <h3 className="text-lg font-medium">{selectedProduct.product_name}</h3>
                  <p className="text-sm text-gray-400">{selectedProduct.generic_name}</p>
                  <p className="text-sm text-gray-400">SKU: {selectedProduct.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p>{selectedProduct.category_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Company</p>
                  <p>{selectedProduct.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">MRP</p>
                  <p>৳{selectedProduct.mrp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Selling Price</p>
                  <p>৳{selectedProduct.selling_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Discount</p>
                  <p>{selectedProduct.discount_percent}% (৳{(selectedProduct.mrp - selectedProduct.selling_price).toFixed(2)})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cost Price</p>
                  <p>৳{selectedProduct.cost_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Stock</p>
                  <p>{selectedProduct.stock_quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge className={getStatusColor(getStatus(selectedProduct))}>
                    {getStatus(selectedProduct)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created On</p>
                  <p>{new Date(selectedProduct.created_on).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Updated On</p>
                  <p>{new Date(selectedProduct.updated_on).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-400">Description</p>
                  <p>{selectedProduct.product_description || "No description available"}</p>
                </div>
              </div>
              <DialogClose asChild>
                <Button className="mt-4 bg-gray-700 hover:bg-gray-600">
                  Close
                </Button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product - ID: {selectedProduct?.product_id}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>
                  <Input
                    id="product_name"
                    {...form.register("product_name")}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.product_name && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.product_name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="generic_id">Generic Name</Label>
                  <Select
                    onValueChange={(value) => form.setValue("generic_id", parseInt(value))}
                    defaultValue={form.getValues("generic_id").toString()}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select generic" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {genericsData?.data?.map((generic: Generic) => (
                        <SelectItem className="text-white" key={generic.generic_id} value={generic.generic_id.toString()}>
                          {generic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.generic_id && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.generic_id.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_id">Company</Label>
                  <Select
                    onValueChange={(value) => form.setValue("company_id", parseInt(value))}
                    defaultValue={form.getValues("company_id")?.toString()}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {companiesData?.data?.map((company: Company) => (
                        <SelectItem className="text-white" key={company.company_id} value={company.company_id.toString()}>
                          {company.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.company_id && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.company_id.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    onValueChange={(value) => form.setValue("category_id", parseInt(value))}
                    defaultValue={form.getValues("category_id").toString()}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categoriesData?.data?.map((category: Category) => (
                        <SelectItem className="text-white" key={category.category_id} value={category.category_id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category_id && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.category_id.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    disabled
                    id="sku"
                    {...form.register("sku")}
                    className="bg-gray-700 readonly border-gray-600"
                  />
                  {form.formState.errors.sku && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.sku.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity_per_box">Quantity per Box</Label>
                  <Input
                    id="quantity_per_box"
                    type="number"
                    {...form.register("quantity_per_box", { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.quantity_per_box && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.quantity_per_box.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    {...form.register("stock_quantity", { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.stock_quantity && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.stock_quantity.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    {...form.register("cost_price", { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.cost_price && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.cost_price.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    {...form.register("mrp", { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.mrp && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.mrp.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    {...form.register("selling_price", { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.selling_price && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.selling_price.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount_percent">Discount Percent</Label>
                  <Input
                    id="discount_percent"
                    disabled
                    type="number"
                    {...form.register("discount_percent", { valueAsNumber: true })}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.discount_percent && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.discount_percent.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <Select
                    onValueChange={(value) => form.setValue("is_active", value === "true")}
                    defaultValue={selectedProduct.is_active ? "true" : "false"}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="product_description">Description</Label>
                  <Textarea
                    id="product_description"
                    {...form.register("product_description")}
                    className="bg-gray-700 border-gray-600 min-h-[100px]"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" className="text-black bg-red-400" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedProduct?.product_name}</span>?
            </p>
            <p className="text-sm text-gray-400">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-black bg-red-400" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// {
//     "status": "success",
//     "data": {
//         "product_id": 5,
//         "product_name": "Becovital",
//         "product_description": "",
//         "product_image": "/media/product_images/medicine-preview_B62EPzZ.png",
//         "sku": "1C9C96B7",
//         "quantity_per_box": 10,
//         "company_id": 5,
//         "company_name": "Renata Limited",
//         "category_id": [
//             7
//         ],
//         "category_name": [
//             "Supplement"
//         ],
//         "stock_quantity": 499,
//         "cost_price": 75.0,
//         "mrp": 90.0,
//         "selling_price": 85.0,
//         "discount_percent": 6,
//         "out_of_stock": false,
//         "is_active": true,
//         "created_on": "2025-08-20T10:32:55.664447Z",
//         "updated_on": "2025-08-22T11:09:51.353499Z"
//     }
// }