"use client"

import { useState } from "react"
import { Search, Filter, Eye, Download, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    products: 3,
    total: "$299.97",
    status: "Delivered",
    date: "2024-01-15",
    payment: "Paid",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    products: 1,
    total: "$89.99",
    status: "Processing",
    date: "2024-01-14",
    payment: "Paid",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    products: 2,
    total: "$159.98",
    status: "Shipped",
    date: "2024-01-13",
    payment: "Paid",
  },
  {
    id: "#ORD-004",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    products: 1,
    total: "$45.99",
    status: "Pending",
    date: "2024-01-12",
    payment: "Pending",
  },
  {
    id: "#ORD-005",
    customer: "David Brown",
    email: "david@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    products: 4,
    total: "$399.96",
    status: "Cancelled",
    date: "2024-01-11",
    payment: "Refunded",
  },
]

const statusFilters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

export default function OrdersContent() {
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/20 text-green-400"
      case "Shipped":
        return "bg-blue-500/20 text-blue-400"
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400"
      case "Pending":
        return "bg-orange-500/20 text-orange-400"
      case "Cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "Paid":
        return "bg-green-500/20 text-green-400"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "Refunded":
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
          <h2 className="text-2xl font-bold text-white mb-2">Orders</h2>
          <p className="text-gray-400">Manage customer orders and fulfillment</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">1,456</div>
            <div className="text-sm text-gray-400">Total Orders</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">23</div>
            <div className="text-sm text-gray-400">Pending</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">156</div>
            <div className="text-sm text-gray-400">Processing</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">1,234</div>
            <div className="text-sm text-gray-400">Delivered</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">43</div>
            <div className="text-sm text-gray-400">Cancelled</div>
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
                  placeholder="Search orders or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={
                    selectedStatus === status ? "bg-blue-600 hover:bg-blue-700" : "text-gray-400 hover:text-white"
                  }
                >
                  {status}
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

      {/* Orders Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Products</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="text-blue-400 font-medium">{order.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={order.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{order.customer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{order.customer}</div>
                          <div className="text-gray-400 text-sm">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{order.products} items</td>
                    <td className="py-3 px-4 text-white font-medium">{order.total}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getPaymentColor(order.payment)}>{order.payment}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{order.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-green-400">
                          <Package className="w-4 h-4" />
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
