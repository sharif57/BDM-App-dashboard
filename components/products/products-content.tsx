"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
]

const categories = ["All", "Clothing", "Accessories", "Footwear", "Electronics"]

export default function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400"
      case "Low Stock":
        return "bg-yellow-500/20 text-yellow-400"
      case "Out of Stock":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Products</h2>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">1,234</div>
            <div className="text-sm text-gray-400">Total Products</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">987</div>
            <div className="text-sm text-gray-400">Active Products</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">23</div>
            <div className="text-sm text-gray-400">Low Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">12</div>
            <div className="text-sm text-gray-400">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : "text-gray-400 hover:text-white"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Sales</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={product.image || "/placeholder.svg"} />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{product.name}</div>
                          <div className="text-gray-400 text-sm">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{product.category}</td>
                    <td className="py-3 px-4 text-white font-medium">{product.price}</td>
                    <td className="py-3 px-4 text-gray-300">{product.stock}</td>
                    <td className="py-3 px-4 text-gray-300">{product.sales}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-green-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
