"use client"

import { Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const notifications = [
  {
    id: 1,
    type: "user",
    message: "New Customer Registration",
    time: "5 mins ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 2, type: "alert", message: "Stock Alert", time: "5 mins ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, type: "order", message: "Order Placed", time: "5 mins ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 4, type: "order", message: "Order Placed", time: "5 mins ago", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: 5,
    type: "user",
    message: "New Customer Registration",
    time: "5 mins ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 6, type: "order", message: "Order Placed", time: "5 mins ago", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: 7,
    type: "user",
    message: "New Customer Registration",
    time: "5 mins ago",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  { id: 8, type: "alert", message: "Stock Alert", time: "5 mins ago", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 9, type: "alert", message: "Stock Alert", time: "5 mins ago", avatar: "/placeholder.svg?height=32&width=32" },
]

export default function NotificationsPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gray-800 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notification</h2>
        <Button variant="ghost" size="sm" className="text-gray-400">
          See All
        </Button>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={notification.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {notification.type === "user" ? "👤" : notification.type === "alert" ? "⚠️" : "📦"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-300 truncate">{notification.message}</div>
              <div className="text-xs text-gray-500">{notification.time}</div>
            </div>

            <div className="flex space-x-1 flex-shrink-0">
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-gray-400 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-gray-400">
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
