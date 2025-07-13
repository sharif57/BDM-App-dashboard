"use client";

import { useState } from "react";
import { Plus, Filter, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { useAllProductsQuery } from "@/redux/feature/productSlice";

const products = [
  {
    id: 1,
    name: "Premium Jeans",
    category: "Clothing",
    price: "$89.99",
    stock: 45,
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    sales: 234,
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    category: "Clothing",
    price: "$24.99",
    stock: 120,
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    sales: 456,
  },
  {
    id: 3,
    name: "Leather Belt",
    category: "Accessories",
    price: "$45.99",
    stock: 8,
    status: "Low Stock",
    image: "/placeholder.svg?height=40&width=40",
    sales: 89,
  },
  {
    id: 4,
    name: "Baseball Cap",
    category: "Accessories",
    price: "$19.99",
    stock: 67,
    status: "Active",
    image: "/placeholder.svg?height=40&width=40",
    sales: 178,
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Footwear",
    price: "$129.99",
    stock: 0,
    status: "Out of Stock",
    image: "/placeholder.svg?height=40&width=40",
    sales: 345,
  },
];

const categories = [
  "All",
  "Clothing",
  "Accessories",
  "Footwear",
  "Electronics",
];

export default function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const {data} =useAllProductsQuery(undefined);
  console.log(data,'dataYeah, no. We fell off OK. Linking the club. Funny. ')

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const handleView = (id: number) => console.log(`View product ${id}`);
  const handleEdit = (id: number) => console.log(`Edit product ${id}`);
  const handleDelete = (id: number) => console.log(`Delete product ${id}`);

  return (
    <div className="p-3 sm:p-4 lg:p-6 ">
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
                  onClick={() => setSelectedCategory(category)}
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
                      Sales
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
                      key={product.id}
                      className="border-b border-gray-700 hover:bg-gray-700/50"
                    >
                      <td className="py-3 px-4 ">
                        <div>
                          <div className="text-gray-400  text-sm">
                            {product.id}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {product.price}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {product.stock}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {product.sales}
                      </td>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
