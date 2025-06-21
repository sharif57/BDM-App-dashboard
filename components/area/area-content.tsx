"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const areas = [
  {
    id: 1,
    name: "North America",
    country: "United States",
    city: "New York",
    customers: 1234,
    orders: 5678,
    revenue: "$234,567",
    status: "Active",
    manager: "John Smith",
  },
  {
    id: 2,
    name: "Europe",
    country: "United Kingdom",
    city: "London",
    customers: 987,
    orders: 3456,
    revenue: "$189,234",
    status: "Active",
    manager: "Emma Wilson",
  },
  {
    id: 3,
    name: "Asia Pacific",
    country: "Japan",
    city: "Tokyo",
    customers: 2345,
    orders: 7890,
    revenue: "$345,678",
    status: "Active",
    manager: "Hiroshi Tanaka",
  },
  {
    id: 4,
    name: "South America",
    country: "Brazil",
    city: "São Paulo",
    customers: 567,
    orders: 1234,
    revenue: "$89,456",
    status: "Inactive",
    manager: "Carlos Rodriguez",
  },
  {
    id: 5,
    name: "Middle East",
    country: "UAE",
    city: "Dubai",
    customers: 789,
    orders: 2345,
    revenue: "$156,789",
    status: "Active",
    manager: "Ahmed Al-Rashid",
  },
]

export default function AreaContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400"
      case "Inactive":
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
          <h2 className="text-2xl font-bold text-white mb-2">Area Management</h2>
          <p className="text-gray-400">Manage regional operations and territories</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Area
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-sm text-gray-400">Total Areas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">18</div>
            <div className="text-sm text-gray-400">Active Areas</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">5,922</div>
            <div className="text-sm text-gray-400">Total Customers</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">$1.2M</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search areas, countries, or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAreas.map((area) => (
          <Card key={area.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{area.name}</CardTitle>
                  <div className="text-gray-400 text-sm mt-1">
                    {area.city}, {area.country}
                  </div>
                  <Badge className={getStatusColor(area.status)} variant="secondary">
                    {area.status}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-green-400">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-gray-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{area.customers}</div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Customers
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{area.orders}</div>
                    <div className="text-sm text-gray-400">Orders</div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{area.revenue}</div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="text-sm text-gray-400">Area Manager</div>
                  <div className="text-white font-medium">{area.manager}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
