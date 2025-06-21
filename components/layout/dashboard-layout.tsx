"use client";

import type React from "react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/layout/sidebar";
import NotificationsPanel from "@/components/layout/notifications-panel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/products":
        return "Products";
      case "/orders":
        return "Orders";
      case "/notice":
        return "Notice";
      case "/user":
        return "User Management";
      case "/area":
        return "Area Management";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex itc h-screen gap-4 bg-[#000209E5] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 bg-gray-800 border-gray-700 w-64"
        >
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-[#2c2e34] p-4 rounded-lg mt-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 bg-gray-800 border-gray-700 w-64"
              >
                <Sidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          </div>
          <div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-48 sm:w-60 lg:w-80"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" className="sm:hidden p-2">
              <Search className="w-5 h-5" />
            </Button>

            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center p-0">
                    1
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 bg-gray-800 border-gray-700 w-80"
              >
                <NotificationsPanel />
              </SheetContent>
            </Sheet>

            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex flex-1 container mx-auto overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 overflow-auto">{children}</div>

          {/* Desktop Notifications Sidebar */}
          {/* <div className="hidden xl:block w-80 border-l border-gray-700">
            <NotificationsPanel />
          </div> */}
        </div>
      </div>
    </div>
  );
}
