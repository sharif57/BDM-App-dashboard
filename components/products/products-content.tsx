
// "use client";

// import { useState } from "react";
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
// } from "@/components/ui/dialog";
// import Link from "next/link";
// import { useAllProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from "@/redux/feature/productSlice";

// interface Product {
//   id: number;
//   name: string;
//   generic_name: string;
//   category: string;
//   price: string;
//   stock: number;
//   status: "Active" | "Low Stock" | "Out of Stock";
//   image: string;
//   sales?: number;
//   description?: string;
//   sku?: string;
//   company_name?: string;
//   discount_percent?: number;
//   cost_price?: string;
//   mrp?: string;
//   discount?: number;
//   selling_price?: number;
//   created_on?: string;
//   updated_on?: string;
// }



// // Dynamic categories from API data
// const getCategories = (products: Product[]) => {
//   const uniqueCategories = new Set<string>();
//   uniqueCategories.add("All");
//   products.forEach((product) => {
//     product.category.split(", ").forEach((cat) => uniqueCategories.add(cat));
//   });
//   return Array.from(uniqueCategories);
// };

// export default function ProductsContent() {
//   const { data, isLoading, isError } = useAllProductsQuery(undefined);

//   const [deleteProduct]=useDeleteProductMutation();

//   const [updateProduct] =useUpdateProductMutation();

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(1000); // Number of items per page

//   // Map API data to products - accessing data.results.data
//  ;

//   // Filter products based on category and search term
//   const filteredProducts = products.filter((product) => {
//     const matchesCategory =
//       selectedCategory === "All" || product.category.includes(selectedCategory);
//     const matchesSearch = product.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

//   const handleView = (id: number) => {
//     const product = products.find((p) => p.id === id);
//     if (product) {
//       setSelectedProduct(product);
//     }
//   };

//   const handleEdit = (id: number) => console.log(`Edit product ${id}`);
//   const handleDelete = (id: number) => console.log(`Delete product ${id}`);

//   if (isLoading) return <div className="text-white p-6">Loading...</div>;
//   if (isError) return <div className="text-red-400 p-6">Error loading products</div>;

//   return (
//     <div className="p-3 sm:p-4 lg:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
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
//                     setCurrentPage(1); // Reset to first page when category changes
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
//             <Button variant="ghost" size="sm" className="text-gray-400">
//               <Filter className="w-4 h-4 mr-2" />
//               Filter
//             </Button>
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
//                     {currentItems.map((product) => (
//                       <tr
//                         key={product.id}
//                         className="border-b border-gray-700 hover:bg-gray-700/50"
//                       >
//                         <td className="py-3 px-4">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={product.image}
//                               alt={product.name}
//                               className="w-10 h-10 rounded"
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40";
//                               }}
//                             />
//                             <div>
//                               <div className="text-white font-medium">{product.name}</div>
//                               <div className="text-gray-400 text-sm">{product.generic_name}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-3 px-4 text-gray-300">{product.category}</td>
//                         <td className="py-3 px-4 text-white font-medium">{product.price}</td>
//                         <td className="py-3 px-4 text-gray-300">{product.stock}</td>
//                         <td className="py-3 px-4">
//                           <Badge className={getStatusColor(product.status)}>
//                             {product.status}
//                           </Badge>
//                         </td>
//                         <td className="py-3 px-4">
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
//                               onClick={() => handleView(product.id)}
//                               aria-label={`View product ${product.name}`}
//                             >
//                               <Eye className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="p-1 h-8 w-8 text-gray-400 hover:text-green-400"
//                               onClick={() => handleEdit(product.id)}
//                               aria-label={`Edit product ${product.name}`}
//                             >
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="p-1 h-8 w-8 text-gray-400 hover:text-red-400"
//                               onClick={() => handleDelete(product.id)}
//                               aria-label={`Delete product ${product.name}`}
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

//               {/* Pagination Controls */}
//               <div className="flex items-center justify-between mt-4">
//                 <div className="text-sm text-gray-400">
//                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     disabled={currentPage === 1}
//                     onClick={() => paginate(currentPage - 1)}
//                     className="text-gray-400 hover:text-white disabled:opacity-50"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </Button>
                  
//                   {/* Page numbers */}
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                     <Button
//                       key={number}
//                       variant={currentPage === number ? "default" : "ghost"}
//                       size="sm"
//                       onClick={() => paginate(number)}
//                       className={
//                         currentPage === number
//                           ? "bg-blue-600 hover:bg-blue-700"
//                           : "text-gray-400 hover:text-white"
//                       }
//                     >
//                       {number}
//                     </Button>
//                   ))}
                  
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     disabled={currentPage === totalPages}
//                     onClick={() => paginate(currentPage + 1)}
//                     className="text-gray-400 hover:text-white disabled:opacity-50"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {/* Modal for Product Details */}
//       <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
//         <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
//           <DialogHeader>
//             <DialogTitle>Product Details - ID: {selectedProduct?.id}</DialogTitle>
//           </DialogHeader>
//           {selectedProduct && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={selectedProduct.image}
//                   alt={selectedProduct.name}
//                   className="w-20 h-20 rounded"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80";
//                   }}
//                 />
//                 <div>
//                   <h3 className="text-lg font-medium">{selectedProduct.name}</h3>
//                   <p className="text-sm text-gray-400">{selectedProduct.generic_name}</p>
//                   <p className="text-sm text-gray-400">SKU: {selectedProduct.sku}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-400">Category</p>
//                   <p>{selectedProduct.category}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Company</p>
//                   <p>{selectedProduct.company_name}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">MRP</p>
//                   <p>{selectedProduct.mrp}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Selling Price</p>
//                   <p>{selectedProduct.price}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Discount</p>
//                   <p>{selectedProduct.discount_percent}% (₹{selectedProduct.discount})</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Cost Price</p>
//                   <p>{selectedProduct.cost_price}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Stock</p>
//                   <p>{selectedProduct.stock}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Status</p>
//                   <Badge className={getStatusColor(selectedProduct.status)}>
//                     {selectedProduct.status}
//                   </Badge>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Created On</p>
//                   <p>{selectedProduct.created_on ? new Date(selectedProduct.created_on).toLocaleString() : "N/A"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Updated On</p>
//                   <p>{selectedProduct.updated_on ? new Date(selectedProduct.updated_on).toLocaleString() : "N/A"}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="text-sm text-gray-400">Description</p>
//                   <p>{selectedProduct.description || "No description available"}</p>
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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
  category_id: number[];
  category_name: string[];
  stock_quantity: number;
  cost_price: string;
  mrp: string;
  selling_price: string;
  discount_percent: number;
  out_of_stock: boolean;
  is_active: boolean;
  created_on: string;
  updated_on: string;
}

const productFormSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  generic_name: z.string().min(1, "Generic name is required"),
  product_description: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  quantity_per_box: z.number().min(1, "Quantity must be at least 1"),
  stock_quantity: z.number().min(0, "Stock cannot be negative"),
  cost_price: z.string().min(1, "Cost price is required"),
  mrp: z.string().min(1, "MRP is required"),
  selling_price: z.string().min(1, "Selling price is required"),
  discount_percent: z.number().min(0, "Discount cannot be negative"),
  is_active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductsContent() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { data: apiData, isLoading, isError, refetch } = useAllProductsQuery(pageSize);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

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
      generic_name: "",
      product_description: "",
      sku: "",
      quantity_per_box: 0,
      stock_quantity: 0,
      cost_price: "",
      mrp: "",
      selling_price: "",
      discount_percent: 0,
      is_active: true,
    },
  });

  // Process API data when loaded
  useEffect(() => {
    if (apiData?.results?.data) {
      const productsData = apiData.results.data;
      setProducts(productsData);
      setTotalProducts(apiData.results.total_products || 0);

      // Extract unique categories
      const uniqueCategories = new Set<string>();
      uniqueCategories.add("All");
      productsData.forEach((product: Product) => {
        product.category_name.forEach((cat) => uniqueCategories.add(cat));
      });
      setCategories(Array.from(uniqueCategories));
    }
  }, [apiData]);

  // Filter products based on category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory = 
      selectedCategory === "All" || 
      product.category_name.includes(selectedCategory);
    const matchesSearch = 
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.generic_name.toLowerCase().includes(searchTerm.toLowerCase());
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
    form.reset({
      product_name: product.product_name,
      generic_name: product.generic_name,
      product_description: product.product_description,
      sku: product.sku,
      quantity_per_box: product.quantity_per_box,
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
      formData.append("generic_name", data.generic_name);
      formData.append("product_description", data.product_description || "");
      formData.append("sku", data.sku);
      formData.append("quantity_per_box", data.quantity_per_box.toString());
      formData.append("stock_quantity", data.stock_quantity.toString());
      formData.append("cost_price", data.cost_price);
      formData.append("mrp", data.mrp);
      formData.append("selling_price", data.selling_price);
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
                      : "text-gray-400 hover:text-white"
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
                          {product.category_name.join(", ")}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">
                          ₹{product.selling_price}
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
                  // src={selectedProduct.product_image}
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
                  <p>{selectedProduct.category_name.join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Company</p>
                  <p>{selectedProduct.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">MRP</p>
                  <p>₹{selectedProduct.mrp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Selling Price</p>
                  <p>₹{selectedProduct.selling_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Discount</p>
                  <p>{selectedProduct.discount_percent}% (₹{(parseFloat(selectedProduct.mrp) - parseFloat(selectedProduct.selling_price)).toFixed(2)})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cost Price</p>
                  <p>₹{selectedProduct.cost_price}</p>
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
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
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
                  <Label htmlFor="generic_name">Generic Name</Label>
                  <Input
                    id="generic_name"
                    {...form.register("generic_name")}
                    className="bg-gray-700 border-gray-600"
                  />
                  {form.formState.errors.generic_name && (
                    <p className="text-sm text-red-400">
                      {form.formState.errors.generic_name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    {...form.register("sku")}
                    className="bg-gray-700 border-gray-600"
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
                    {...form.register("cost_price")}
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
                    {...form.register("mrp")}
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
                    {...form.register("selling_price")}
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