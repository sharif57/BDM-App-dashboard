"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check, Info, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  userName: string
  joiningDate: string
  emailId: string
  phoneNum: string
  shopName: string
  area: string
  address: string
  status: "Pending" | "Inactive" | "Active"
}

const mockUsers: User[] = [
  {
    id: "1",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Pending",
  },
  {
    id: "2",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Inactive",
  },
  {
    id: "3",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Active",
  },
  {
    id: "4",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Active",
  },
  {
    id: "5",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Active",
  },
  {
    id: "6",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Active",
  },
  {
    id: "7",
    userName: "Mahmud",
    joiningDate: "23 June 2024",
    emailId: "mahmudgajigaji@gmail.com",
    phoneNum: "01768481561",
    shopName: "MJ pharma",
    area: "Rampura",
    address: "Rampura",
    status: "Active",
  },
]

export default function Component() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [currentPage, setCurrentPage] = useState(2)
  const totalPages = 24
  const newUserRequests = 3

  const handleStatusChange = (userIndex: number, newStatus: "Pending" | "Inactive" | "Active") => {
    setUsers((prev) => prev.map((user, index) => (index === userIndex ? { ...user, status: newStatus } : user)))
  }

  const handleAction = (userIndex: number, action: "approve" | "info" | "delete") => {
    switch (action) {
      case "approve":
        handleStatusChange(userIndex, "Active")
        break
      case "info":
        console.log("View user info:", users[userIndex])
        break
      case "delete":
        setUsers((prev) => prev.filter((_, index) => index !== userIndex))
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-red-400"
      case "Inactive":
        return "text-gray-400"
      case "Active":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const renderPagination = () => {
    const pages = []

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="text-white hover:bg-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>,
    )

    // Page numbers
    for (let i = 1; i <= 6; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "ghost"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? "bg-green-500 hover:bg-green-600 text-white" : "text-white hover:bg-gray-700"}
        >
          {i}
        </Button>,
      )
    }

    // Ellipsis and last page
    pages.push(
      <span key="ellipsis" className="text-gray-400 px-2">
        ...
      </span>,
    )
    pages.push(
      <Button
        key={totalPages}
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage(totalPages)}
        className="text-white hover:bg-gray-700"
      >
        {totalPages}
      </Button>,
    )

    // Next button
    pages.push(
      <Button
        key="next"
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="text-white hover:bg-gray-700"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>,
    )

    return pages
  }

  return (
    <div className=" text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">User Details</h1>

        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            You have {newUserRequests} new user request
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white px-6">Details</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-9 gap-4 p-4 border-b border-gray-600 text-sm font-medium text-gray-300">
          <div>User Name</div>
          <div>Joining Date</div>
          <div>Email ID</div>
          <div>Phone Num</div>
          <div>Shop Name</div>
          <div>Area</div>
          <div>Address</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-600">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="grid grid-cols-9 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-white">{user.userName}</div>
              <div className="text-gray-300">{user.joiningDate}</div>
              <div className="text-gray-300 text-sm">{user.emailId}</div>
              <div className="text-gray-300">{user.phoneNum}</div>
              <div className="text-gray-300">{user.shopName}</div>
              <div className="text-gray-300">{user.area}</div>
              <div className="text-gray-300">{user.address}</div>
              <div>
                <Select
                  value={user.status}
                  onValueChange={(value: "Pending" | "Inactive" | "Active") => handleStatusChange(index, value)}
                >
                  <SelectTrigger className="w-20 bg-transparent border-none p-0 h-auto">
                    <SelectValue className={`${getStatusColor(user.status)} font-medium text-sm`} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-gray-600">
                    <SelectItem value="Pending" className="text-red-400">
                      Pending
                    </SelectItem>
                    <SelectItem value="Inactive" className="text-gray-400">
                      Inactive
                    </SelectItem>
                    <SelectItem value="Active" className="text-green-400">
                      Active
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "approve")}
                  className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600 rounded-full"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "info")}
                  className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(index, "delete")}
                  className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">{renderPagination()}</div>
    </div>
  )
}
