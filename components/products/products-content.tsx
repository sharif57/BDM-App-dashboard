
// // "use client";

// // import { useState } from "react";
// // import { Plus, Filter, Edit, Trash2, Eye } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogClose,
// // } from "@/components/ui/dialog";
// // import Link from "next/link";
// // import { useAllProductsQuery } from "@/redux/feature/productSlice";

// // interface Product {
// //   id: number;
// //   name: string;
// //   category: string;
// //   price: string;
// //   stock: number;
// //   status: "Active" | "Low Stock" | "Out of Stock";
// //   image: string;
// //   sales?: number; // Optional, as API doesn't provide sales
// //   description?: string;
// //   sku?: string;
// //   company_name?: string;
// //   discount_percent?: number;
// //   cost_price?: string;
// //   mrp?: string;
// //   discount?: number;
// //   selling_price?: number;
// //   created_on?: string;
// //   updated_on?: string;
// // }

// // // Helper function to map API data to Product interface
// // const mapApiToProducts = (apiData: any[]): Product[] => {
// //   return apiData.map((product) => ({
// //     id: product.product_id,
// //     name: product.product_name,
// //     category: product.category_name.join(", "), // Join multiple categories
// //     price: `₹${product.selling_price.toFixed(2)}`,
// //     stock: product.stock_quantity,
// //     status: product.out_of_stock
// //       ? "Out of Stock"
// //       : product.stock_quantity < 10
// //         ? "Low Stock"
// //         : "Active",
// //     image: product.product_image || "/placeholder.svg?height=40&width=40",
// //     sales: 0, // Placeholder, as API doesn't provide sales
// //     description: product.product_description,
// //     sku: product.sku,
// //     company_name: product.company_name,
// //     discount_percent: product.discount_percent,
// //     cost_price: `₹${product.cost_price}`,
// //     mrp: `₹${product.mrp}`,
// //     discount: product.discount,
// //     selling_price: product.selling_price,
// //     created_on: product.created_on,
// //     updated_on: product.updated_on,
// //   }));
// // };

// // // Dynamic categories from API data
// // const getCategories = (products: Product[]) => {
// //   const uniqueCategories = new Set<string>();
// //   uniqueCategories.add("All");
// //   products.forEach((product) => {
// //     product.category.split(", ").forEach((cat) => uniqueCategories.add(cat));
// //   });
// //   return Array.from(uniqueCategories);
// // };

// // export default function ProductsContent() {
// //   const { data, isLoading, isError } = useAllProductsQuery(undefined);
// //   console.log(data, 'data from products API');
// //   const [selectedCategory, setSelectedCategory] = useState("All");
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State for modal

// //   // Map API data to products
// //   const products = data?.data ? mapApiToProducts(data.data) : [];
// // console.log
// //   const categories = getCategories(products);

// //   const filteredProducts = products.filter((product) => {
// //     const matchesCategory =
// //       selectedCategory === "All" || product.category.includes(selectedCategory);
// //     const matchesSearch = product.name
// //       .toLowerCase()
// //       .includes(searchTerm.toLowerCase());
// //     return matchesCategory && matchesSearch;
// //   });

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case "Active":
// //         return "bg-green-500/20 text-green-400";
// //       case "Low Stock":
// //         return "bg-yellow-500/20 text-yellow-400";
// //       case "Out of Stock":
// //         return "bg-red-500/20 text-red-400";
// //       default:
// //         return "bg-gray-500/20 text-gray-400";
// //     }
// //   };

// //   const handleView = (id: number) => {
// //     const product = products.find((p) => p.id === id);
// //     if (product) {
// //       setSelectedProduct(product); // Open modal with product details
// //     }
// //   };

// //   const handleEdit = (id: number) => console.log(`Edit product ${id}`);
// //   const handleDelete = (id: number) => console.log(`Delete product ${id}`);

// //   if (isLoading) return <div className="text-white p-6">Loading...</div>;
// //   if (isError) return <div className="text-red-400 p-6">Error loading products</div>;

// //   return (
// //     <div className="p-3 sm:p-4 lg:p-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
// //         <div>
// //           <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
// //         </div>
// //         <Link href="/products/add-product">
// //           <Button className="bg-[#44B46E] hover:bg-[#44B46E] rounded-full">
// //             <Plus className="w-4 h-4 mr-2" />
// //             Add Product
// //           </Button>
// //         </Link>
// //       </div>

// //       {/* Filters */}
// //       <Card className="bg-gray-800 border-gray-700 mb-6">
// //         <CardContent className="p-4">
// //           <div className="flex flex-col lg:flex-row gap-4">
// //             <div className="flex gap-2 flex-wrap">
// //               {categories.map((category) => (
// //                 <Button
// //                   key={category}
// //                   variant={selectedCategory === category ? "default" : "ghost"}
// //                   size="sm"
// //                   onClick={() => setSelectedCategory(category)}
// //                   className={
// //                     selectedCategory === category
// //                       ? "bg-blue-600 hover:bg-blue-700"
// //                       : "text-gray-400 hover:text-white"
// //                   }
// //                 >
// //                   {category}
// //                 </Button>
// //               ))}
// //             </div>
// //             <Button variant="ghost" size="sm" className="text-gray-400">
// //               <Filter className="w-4 h-4 mr-2" />
// //               Filter
// //             </Button>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Products Table */}
// //       <Card className="bg-gray-800 border-gray-700">
// //         <CardHeader>
// //           <CardTitle className="text-white">Product List</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {filteredProducts.length === 0 ? (
// //             <div className="text-center text-gray-400 py-6">
// //               No products found.
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="w-full" role="grid">
// //                 <thead>
// //                   <tr className="border-b border-gray-700">
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Product
// //                     </th>
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Category
// //                     </th>
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Price
// //                     </th>
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Stock
// //                     </th>
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Sales
// //                     </th>
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Status
// //                     </th>
// //                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredProducts.map((product) => (
// //                     <tr
// //                       key={product.id}
// //                       className="border-b border-gray-700 hover:bg-gray-700/50"
// //                     >
// //                       <td className="py-3 px-4">
// //                         <div className="flex items-center gap-3">
// //                           <img
// //                             src={`http://teamerror.net${product.image}`}
// //                             alt={product.name}
// //                             className="w-10 h-10 rounded"
// //                           />
// //                           <div>
// //                             <div className="text-white font-medium">{product.name}</div>
// //                             <div className="text-gray-400 text-sm">{product.id}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="py-3 px-4 text-gray-300">{product.category}</td>
// //                       <td className="py-3 px-4 text-white font-medium">{product.price}</td>
// //                       <td className="py-3 px-4 text-gray-300">{product.stock}</td>
// //                       <td className="py-3 px-4 text-gray-300">{product.sales}</td>
// //                       <td className="py-3 px-4">
// //                         <Badge className={getStatusColor(product.status)}>
// //                           {product.status}
// //                         </Badge>
// //                       </td>
// //                       <td className="py-3 px-4">
// //                         <div className="flex space-x-2">
// //                           <Button
// //                             variant="ghost"
// //                             size="sm"
// //                             className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
// //                             onClick={() => handleView(product.id)}
// //                             aria-label={`View product ${product.name}`}
// //                           >
// //                             <Eye className="w-4 h-4" />
// //                           </Button>
// //                           <Button
// //                             variant="ghost"
// //                             size="sm"
// //                             className="p-1 h-8 w-8 text-gray-400 hover:text-green-400"
// //                             onClick={() => handleEdit(product.id)}
// //                             aria-label={`Edit product ${product.name}`}
// //                           >
// //                             <Edit className="w-4 h-4" />
// //                           </Button>
// //                           <Button
// //                             variant="ghost"
// //                             size="sm"
// //                             className="p-1 h-8 w-8 text-gray-400 hover:text-red-400"
// //                             onClick={() => handleDelete(product.id)}
// //                             aria-label={`Delete product ${product.name}`}
// //                           >
// //                             <Trash2 className="w-4 h-4" />
// //                           </Button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </CardContent>
// //       </Card>

// //       {/* Modal for Product Details */}
// //       <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
// //         <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
// //           <DialogHeader>
// //             <DialogTitle>Product Details - ID: {selectedProduct?.id}</DialogTitle>
// //           </DialogHeader>
// //           {selectedProduct && (
// //             <div className="space-y-4">
// //               <div className="flex items-center gap-4">
// //                 <img
// //                   src={selectedProduct.image}
// //                   alt={selectedProduct.name}
// //                   className="w-20 h-20 rounded"
// //                 />
// //                 <div>
// //                   <h3 className="text-lg font-medium">{selectedProduct.name}</h3>
// //                   <p className="text-sm text-gray-400">SKU: {selectedProduct.sku}</p>
// //                 </div>
// //               </div>
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div>
// //                   <p className="text-sm text-gray-400">Category</p>
// //                   <p>{selectedProduct.category}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Company</p>
// //                   <p>{selectedProduct.company_name}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">MRP</p>
// //                   <p>{selectedProduct.mrp}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Selling Price</p>
// //                   <p>{selectedProduct.price}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Discount</p>
// //                   <p>{selectedProduct.discount_percent}% (₹{selectedProduct.discount?.toFixed(2)})</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Cost Price</p>
// //                   <p>{selectedProduct.cost_price}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Stock</p>
// //                   <p>{selectedProduct.stock}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Status</p>
// //                   <p className={getStatusColor(selectedProduct.status)}>
// //                     {selectedProduct.status}
// //                   </p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Created On</p>
// //                   <p>{selectedProduct.created_on ? new Date(selectedProduct.created_on).toLocaleString() : "N/A"}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm text-gray-400">Updated On</p>
// //                   <p>{selectedProduct.updated_on ? new Date(selectedProduct.updated_on).toLocaleString() : "N/A"}</p>
// //                 </div>
// //                 <div className="col-span-2">
// //                   <p className="text-sm text-gray-400">Description</p>
// //                   <p>{selectedProduct.description || "No description available"}</p>
// //                 </div>
// //               </div>
// //               <DialogClose asChild>
// //                 <Button className="mt-4 bg-gray-700 hover:bg-gray-600">
// //                   Close
// //                 </Button>
// //               </DialogClose>
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }
// "use client";

// import { useState } from "react";
// import { Plus, Filter, Edit, Trash2, Eye } from "lucide-react";
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
// import { useAllProductsQuery } from "@/redux/feature/productSlice";

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

// // Helper function to map API data to Product interface
// const mapApiToProducts = (apiData: any[]): Product[] => {
//   return apiData.map((product) => ({
//     id: product.product_id,
//     name: product.product_name,
//     generic_name: product.generic_name,
//     category: product.category_name.join(", "),
//     // price: `₹${product?.selling_price?.toFixed(2)}`,
//     stock: product.stock_quantity,
//     status: product.out_of_stock
//       ? "Out of Stock"
//       : product.stock_quantity < 10
//         ? "Low Stock"
//         : "Active",
//     image: product.product_image ? `http://teamerror.net${product.product_image}` : "/placeholder.svg?height=40&width=40",
//     description: product.product_description,
//     sku: product.sku,
//     company_name: product.company_name,
//     discount_percent: product.discount_percent,
//     cost_price: `₹${product.cost_price}`,
//     mrp: `₹${product.mrp}`,
//     discount: product.discount_percent ? 
//       (product.mrp * product.discount_percent / 100).toFixed(2) : 0,
//     selling_price: product.selling_price,
//     created_on: product.created_on,
//     updated_on: product.updated_on,
//   }));
// };

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
//   const { data, isLoading, isError } = useAllProductsQuery({ limit: 100 }); // Adjust limit as needed
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   // Map API data to products - accessing data.results.data
//   const apiData = data?.results?.data || [];
//   const products = mapApiToProducts(apiData);
//   const categories = getCategories(products);

//   const filteredProducts = products.filter((product) => {
//     const matchesCategory =
//       selectedCategory === "All" || product.category.includes(selectedCategory);
//     const matchesSearch = product.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

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
//                   onClick={() => setSelectedCategory(category)}
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
//             <div className="overflow-x-auto">
//               <table className="w-full" role="grid">
//                 <thead>
//                   <tr className="border-b border-gray-700">
//                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                       Product
//                     </th>
//                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                       Category
//                     </th>
//                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                       Price
//                     </th>
//                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                       Stock
//                     </th>
//                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                       Status
//                     </th>
//                     <th className="text-left py-3 px-4 text-gray-400 font-medium">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredProducts.map((product) => (
//                     <tr
//                       key={product.id}
//                       className="border-b border-gray-700 hover:bg-gray-700/50"
//                     >
//                       <td className="py-3 px-4">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={product.image}
//                             alt={product.name}
//                             className="w-10 h-10 rounded"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40";
//                             }}
//                           />
//                           <div>
//                             <div className="text-white font-medium">{product.name}</div>
//                             <div className="text-gray-400 text-sm">{product.generic_name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-3 px-4 text-gray-300">{product.category}</td>
//                       <td className="py-3 px-4 text-white font-medium">{product.price}</td>
//                       <td className="py-3 px-4 text-gray-300">{product.stock}</td>
//                       <td className="py-3 px-4">
//                         <Badge className={getStatusColor(product.status)}>
//                           {product.status}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
//                             onClick={() => handleView(product.id)}
//                             aria-label={`View product ${product.name}`}
//                           >
//                             <Eye className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 h-8 w-8 text-gray-400 hover:text-green-400"
//                             onClick={() => handleEdit(product.id)}
//                             aria-label={`Edit product ${product.name}`}
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 h-8 w-8 text-gray-400 hover:text-red-400"
//                             onClick={() => handleDelete(product.id)}
//                             aria-label={`Delete product ${product.name}`}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
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

import { useState } from "react";
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
} from "@/components/ui/dialog";
import Link from "next/link";
import { useAllProductsQuery } from "@/redux/feature/productSlice";

interface Product {
  id: number;
  name: string;
  generic_name: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
  image: string;
  sales?: number;
  description?: string;
  sku?: string;
  company_name?: string;
  discount_percent?: number;
  cost_price?: string;
  mrp?: string;
  discount?: number;
  selling_price?: number;
  created_on?: string;
  updated_on?: string;
}

// Helper function to map API data to Product interface
const mapApiToProducts = (apiData: any[]): Product[] => {
  return apiData.map((product) => ({
    id: product.product_id,
    name: product.product_name,
    generic_name: product.generic_name,
    category: product.category_name.join(", "),
    // price: `₹${product.selling_price.toFixed(2)}`,
    stock: product.stock_quantity,
    status: product.out_of_stock
      ? "Out of Stock"
      : product.stock_quantity < 10
        ? "Low Stock"
        : "Active",
    image: product.product_image ? `http://teamerror.net${product.product_image}` : "/placeholder.svg?height=40&width=40",
    description: product.product_description,
    sku: product.sku,
    company_name: product.company_name,
    discount_percent: product.discount_percent,
    cost_price: `₹${product.cost_price}`,
    mrp: `₹${product.mrp}`,
    discount: product.discount_percent ? 
      (product.mrp * product.discount_percent / 100).toFixed(2) : 0,
    selling_price: product.selling_price,
    created_on: product.created_on,
    updated_on: product.updated_on,
  }));
};

// Dynamic categories from API data
const getCategories = (products: Product[]) => {
  const uniqueCategories = new Set<string>();
  uniqueCategories.add("All");
  products.forEach((product) => {
    product.category.split(", ").forEach((cat) => uniqueCategories.add(cat));
  });
  return Array.from(uniqueCategories);
};

export default function ProductsContent() {
  const { data, isLoading, isError } = useAllProductsQuery(undefined);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  // Map API data to products - accessing data.results.data
  const apiData = data?.results?.data || [];
  const products = mapApiToProducts(apiData);
  const categories = getCategories(products);

  // Filter products based on category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category.includes(selectedCategory);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  const handleView = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleEdit = (id: number) => console.log(`Edit product ${id}`);
  const handleDelete = (id: number) => console.log(`Delete product ${id}`);

  if (isLoading) return <div className="text-white p-6">Loading...</div>;
  if (isError) return <div className="text-red-400 p-6">Error loading products</div>;

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
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
                    setCurrentPage(1); // Reset to first page when category changes
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
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
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
                    {currentItems.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-700 hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40";
                              }}
                            />
                            <div>
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-gray-400 text-sm">{product.generic_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{product.category}</td>
                        <td className="py-3 px-4 text-white font-medium">{product.price}</td>
                        <td className="py-3 px-4 text-gray-300">{product.stock}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400"
                              onClick={() => handleView(product.id)}
                              aria-label={`View product ${product.name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-gray-400 hover:text-green-400"
                              onClick={() => handleEdit(product.id)}
                              aria-label={`Edit product ${product.name}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8 text-gray-400 hover:text-red-400"
                              onClick={() => handleDelete(product.id)}
                              aria-label={`Delete product ${product.name}`}
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

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "ghost"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className={
                        currentPage === number
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "text-gray-400 hover:text-white"
                      }
                    >
                      {number}
                    </Button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    className="text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal for Product Details */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
          <DialogHeader>
            <DialogTitle>Product Details - ID: {selectedProduct?.id}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-20 h-20 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80";
                  }}
                />
                <div>
                  <h3 className="text-lg font-medium">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-400">{selectedProduct.generic_name}</p>
                  <p className="text-sm text-gray-400">SKU: {selectedProduct.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Company</p>
                  <p>{selectedProduct.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">MRP</p>
                  <p>{selectedProduct.mrp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Selling Price</p>
                  <p>{selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Discount</p>
                  <p>{selectedProduct.discount_percent}% (₹{selectedProduct.discount})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Cost Price</p>
                  <p>{selectedProduct.cost_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Stock</p>
                  <p>{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge className={getStatusColor(selectedProduct.status)}>
                    {selectedProduct.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created On</p>
                  <p>{selectedProduct.created_on ? new Date(selectedProduct.created_on).toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Updated On</p>
                  <p>{selectedProduct.updated_on ? new Date(selectedProduct.updated_on).toLocaleString() : "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-400">Description</p>
                  <p>{selectedProduct.description || "No description available"}</p>
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
    </div>
  );
}