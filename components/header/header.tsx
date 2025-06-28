import { Sheet } from "lucide-react";
import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NotificationsPanel from "@/components/layout/notifications-panel";
import { SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "../layout/sidebar";

export default function Header() {
  return (
    <div>
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
          {/* <h1 className="text-xl font-semibold">{getPageTitle()}</h1> */}
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

          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
}
