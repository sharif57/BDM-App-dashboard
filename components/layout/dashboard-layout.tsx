
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/layout/sidebar";
import { useUserProfileQuery } from "@/redux/feature/userSlice";
import { useAllNotificationsQuery, useLowStockCountQuery } from "@/redux/feature/notificationSlice";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: profileData } = useUserProfileQuery(undefined);
  const { data } = useLowStockCountQuery(undefined);
  console.log(data?.low_stock_product_count, '===========================')

  const IMAGE_BASE_URL = "https://api.bdmpharmacy.store";

  // Close the mobile sidebar whenever route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Skip layout for auth-related pages
  if (
    pathname === "/auth/login" ||
    pathname === "/auth/forgot-password" ||
    pathname === "/auth/verify-email"
  ) {
    return <>{children}</>;
  }

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
    <div className="flex h-screen overflow-hidden bg-[#000209E5] text-white">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block w-64 fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen lg:ml-[272px]">
        {/* Header - Fixed */}
        <header className="fixed mt-2 rounded-xl top-0 left-0 lg:left-[272px] right-0 bg-[#2c2e34] p-4 flex items-center justify-between border-b border-gray-700 z-10">
          <div className="flex items-center space-x-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/products" className="relative inline-flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="relative p-3 rounded-full hover:bg-gray-800 transition"
              >
                <BellRing className="w-8 h-8 text-gray-300" />
              </Button>

              {data?.low_stock_product_count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center ring-2 ring-[#2c2e34] shadow-md">
                  {data.low_stock_product_count > 99 ? "99+" : data.low_stock_product_count}
                </span>
              )}
            </Link>

            <Avatar className="w-8 h-8">
              <AvatarImage src={IMAGE_BASE_URL + profileData?.image} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 mt-16 w-full overflow-y-auto py-4">
          {children}
        </div>
      </div>
    </div>
  );
}