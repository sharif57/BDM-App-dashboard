"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15",
    orders: 23,
    totalSpent: "$2,340.50",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Customer",
    status: "Active",
    lastLogin: "2024-01-14",
    orders: 12,
    totalSpent: "$890.25",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Manager",
    status: "Active",
    lastLogin: "2024-01-13",
    orders: 8,
    totalSpent: "$1,250.00",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Customer",
    status: "Inactive",
    lastLogin: "2024-01-05",
    orders: 3,
    totalSpent: "$145.75",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Customer",
    status: "Suspended",
    lastLogin: "2024-01-01",
    orders: 1,
    totalSpent: "$89.99",
  },
]

const roles = ["All", "Admin", "Manager", "Customer"]
const statuses = ["All", "Active", "Inactive", "Suspended"]

export default function UserContent() {
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === "All" || user.role === selectedRole
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesStatus && matchesSearch
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-500/20 text-red-400"
      case "Manager":
        return "bg-blue-500/20 text-blue-400"
      case "Customer":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400"
      case "Inactive":
        return "bg-yellow-500/20 text-yellow-400"
      case "Suspended":
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
          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">2,456</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">2,234</div>
            <div className="text-sm text-gray-400">Active Users</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">156</div>
            <div className="text-sm text-gray-400">Inactive Users</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">66</div>
            <div className="text-sm text-gray-400">Suspended</div>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 text-sm"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role} Role
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status} Status
                  </option>
                ))}
              </select>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Last Login</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Orders</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Total Spent</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{user.lastLogin}</td>
                    <td className="py-3 px-4 text-gray-300">{user.orders}</td>
                    <td className="py-3 px-4 text-white font-medium">{user.totalSpent}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-green-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-yellow-400">
                          {user.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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
