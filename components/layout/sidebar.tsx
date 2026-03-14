// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { ChevronRight, LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { logout } from "@/service/authService";
// import { toast } from "sonner";
// import { useSettingDataQuery, useUserProfileQuery } from "@/redux/feature/userSlice";

// const sidebarItems = [
//   { name: "Dashboard", href: "/" },
//   { name: "Products", href: "/products" },
//   { name: "Orders", href: "/orders" },
//   { name: "Notice", href: "/notice" },
//   { name: "User", href: "/user" },
//   { name: "Area", href: "/area" },
//   { name: 'Category', href: '/category' },
//   { name: 'Company', href: '/company' },
//   { name: 'Generic', href: '/generic' },
//   { name: "Banner", href: "/banner" },
//   { name: "Stock", href: "/stock" },
//   { name: 'Batch', href: '/batch' },
//   { name: "Privacy Policy", href: "/privacy-policy" },
//   { name: "Settings", href: "/settings" },
// ];

// export default function Sidebar({ className = "" }: { className?: string }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { data } = useSettingDataQuery(undefined);

//   const { data: profileData } = useUserProfileQuery(undefined);
//   console.log(profileData ,'==================profileData')

//   const isItemActive = (href: string) => {
//     if (href === "/") return pathname === "/";
//     return pathname === href || pathname.startsWith(`${href}/`);
//   };




//   if (pathname === "/auth/login" || pathname === "/register") {
//     return null;
//   }

//   const handleLogOut = async () => {
//     if (toast.info("Logging out...")) {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       await logout();
//       setTimeout(() => {
//         router.push("/auth/login");
//       }, 1000);
//     }
//   };

//   const IMAGE = process.env.NEXT_PUBLIC_IMAGE_URL;

//   return (
//     <div className={`bg-[#2c2e34] p-4 flex flex-col h-full overflow-hidden ${className}`}>
//       {/* Logo */}
//       <div className="flex items-center justify-center mt-2 mb-7">
//         <Image
//           // src="/image 3.png"
//           src={`${IMAGE}${data?.data[0].logo}`}
//           alt="Logo"
//           width={400}
//           height={400}
//           className="size-[80px] flex items-center justify-center "
//         />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto pr-1">
//         {sidebarItems.map((item) => {
//           const isActive = isItemActive(item.href);
//           return (
//             <Link key={item.name} href={item.href}>
//               <div
//                 className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors ${isActive
//                   ? "bg-gray-700 text-white"
//                   : "text-gray-400 hover:bg-gray-700 hover:text-white"
//                   }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   {/* <span className="text-lg">{item.icon}</span> */}
//                   <span>{item.name}</span>
//                 </div>
//                 <ChevronRight className="w-4 h-4" />
//               </div>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Log Out */}
//       {/* <Link href="/auth/login"> */}
//       <Button
//         onClick={handleLogOut}
//         variant="ghost"
//         className="mt-3 shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 justify-start p-3"
//       >
//         <LogOut className="w-4 h-4 mr-2" />
//         Log Out
//       </Button>
//       {/* </Link> */}
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logout } from "@/service/authService";
import { toast } from "sonner";
import {
  useSettingDataQuery,
  useUserProfileQuery,
} from "@/redux/feature/userSlice";

const sidebarItems = [
  { name: "Dashboard", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Orders", href: "/orders" },
  { name: "Notice", href: "/notice" },
  { name: "User", href: "/user" },
  { name: "Area", href: "/area" },
  { name: "Category", href: "/category" },
  { name: "Company", href: "/company" },
  { name: "Generic", href: "/generic" },
  { name: "Banner", href: "/banner" },
  { name: "Stock", href: "/stock" },
  { name: "Batch", href: "/batch" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data } = useSettingDataQuery(undefined);
  const { data: profileData } = useUserProfileQuery(undefined);

  const isSuperUser = profileData?.is_superuser;

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (pathname === "/auth/login" || pathname === "/register") {
    return null;
  }

  const handleLogOut = async () => {
    toast.info("Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    await logout();
    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  const IMAGE = process.env.NEXT_PUBLIC_IMAGE_URL;

  // superuser না হলে User menu hide হবে
  const filteredSidebarItems = isSuperUser
    ? sidebarItems
    : sidebarItems.filter((item) => item.href !== "/user");

  return (
    <div
      className={`bg-[#2c2e34] p-4 flex flex-col h-full overflow-hidden ${className}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center mt-2 mb-7">
        <Image
          src={
            data?.data?.[0]?.logo
              ? `${IMAGE}${data.data[0].logo}`
              : "/placeholder.png"
          }
          alt="Logo"
          width={400}
          height={400}
          className="size-[80px] object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pr-1">
        {filteredSidebarItems.map((item) => {
          const isActive = isItemActive(item.href);

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Log Out */}
      <Button
        onClick={handleLogOut}
        variant="ghost"
        className="mt-3 shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 justify-start p-3"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}