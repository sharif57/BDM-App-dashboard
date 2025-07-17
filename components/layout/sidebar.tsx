"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const sidebarItems = [
  { name: "Dashboard", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Orders", href: "/orders" },
  { name: "Notice", href: "/notice" },
  { name: "User", href: "/user" },
  { name: "Area", href: "/area" },
  { name: 'Category', href: '/category' },
  { name: 'Company', href: '/company' },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  if (pathname === "/auth/login" || pathname === "/register") {
    return null;
  }

  return (
    <div className={`bg-[#2c2e34] p-4 flex flex-col h-full ${className}`}>
      {/* Logo */}
      <div className="flex items-center justify-center mt-16 mb-7">
        <Image
          src="/image 3.png"
          alt="Logo"
          width={400}
          height={400}
          className="size-[80px] flex items-center justify-center "
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors ${isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  {/* <span className="text-lg">{item.icon}</span> */}
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Log Out */}
      <Link href="/auth/login">
        <Button
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 justify-start p-3"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </Link>
    </div>
  );
}
