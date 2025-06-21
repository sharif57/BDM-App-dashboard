"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const notices = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    content: "We will be performing system maintenance on January 20th from 2:00 AM to 4:00 AM EST.",
    type: "System",
    priority: "High",
    status: "Active",
    date: "2024-01-15",
    author: "Admin",
  },
  {
    id: 2,
    title: "New Product Launch",
    content: "Exciting new products are now available in our store. Check them out!",
    type: "Product",
    priority: "Medium",
    status: "Active",
    date: "2024-01-14",
    author: "Marketing Team",
  },
  {
    id: 3,
    title: "Holiday Sale Extended",
    content: "Due to popular demand, our holiday sale has been extended until January 31st.",
    type: "Promotion",
    priority: "Medium",
    status: "Active",
    date: "2024-01-13",
    author: "Sales Team",
  },
  {
    id: 4,
    title: "Security Update",
    content: "Important security updates have been applied to improve system protection.",
    type: "Security",
    priority: "High",
    status: "Archived",
    date: "2024-01-10",
    author: "IT Team",
  },
  {
    id: 5,
    title: "Customer Service Hours",
    content: "Our customer service hours have been updated. We're now available 24/7.",
    type: "Service",
    priority: "Low",
    status: "Active",
    date: "2024-01-08",
    author: "Support Team",
  },
]

const noticeTypes = ["All", "System", "Product", "Promotion", "Security", "Service"]
const priorities = ["All", "High", "Medium", "Low"]

export default function NoticeContent() {
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotices = notices.filter((notice) => {
    const matchesType = selectedType === "All" || notice.type === selectedType
    const matchesPriority = selectedPriority === "All" || notice.priority === selectedPriority
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesPriority && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "Low":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400"
      case "Archived":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "System":
        return "⚙️"
      case "Product":
        return "📦"
      case "Promotion":
        return "🎉"
      case "Security":
        return "🔒"
      case "Service":
        return "🛠️"
      default:
        return "📢"
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Notice Board</h2>
          <p className="text-gray-400">Manage announcements and notifications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Notice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-sm text-gray-400">Total Notices</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">18</div>
            <div className="text-sm text-gray-400">Active Notices</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">5</div>
            <div className="text-sm text-gray-400">High Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-400">6</div>
            <div className="text-sm text-gray-400">Archived</div>
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
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 text-sm"
              >
                {noticeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type} Type
                  </option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 text-sm"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority} Priority
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNotices.map((notice) => (
          <Card key={notice.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(notice.type)}</div>
                  <div>
                    <CardTitle className="text-white text-lg">{notice.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getPriorityColor(notice.priority)}>{notice.priority}</Badge>
                      <Badge className={getStatusColor(notice.status)}>{notice.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
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
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{notice.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>By {notice.author}</span>
                <span>{notice.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
