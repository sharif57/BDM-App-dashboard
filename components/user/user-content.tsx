
// "use client";

// import { useState, useEffect } from "react";
// import {  Info, Trash2, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAllUsersQuery, useDeleteUserMutation } from "@/redux/feature/userSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";

// interface User {
//   id: string;
//   userName: string;
//   joiningDate: string;
//   emailId: string;
//   phoneNum: string;
//   shopName: string;
//   area: string;
//   address: string;
//   status: "Pending" | "Inactive" | "Active";
//   image: string | null;
//   isStaff: boolean;
//   isSuperuser: boolean;
// }

// export default function UserManagement() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetch users data from the API
//   const { data, error, isLoading } = useAllUsersQuery(undefined);

//   const [deleteUser] = useDeleteUserMutation();
  
//   useEffect(() => {
//     if (data?.results?.data) {
//       const mappedUsers = data.results.data.map((user: any) => ({
//         id: user.user_id.toString(),
//         userName: user.full_name,
//         joiningDate: new Date(user.date_joined).toLocaleDateString(),
//         emailId: user.email,
//         phoneNum: user.phone,
//         shopName: user.shop_name || "N/A",
//         area: user.area_name || "N/A",
//         address: user.shop_address || "N/A",
//         status: user.is_active
//           ? "Active"
//           : user.is_approved
//           ? "Pending"
//           : "Inactive",
//         image: user.image ? `https://mehedidev.net${user.image}` : null,
//         isStaff: user.is_staff,
//         isSuperuser: user.is_superuser,
//       }));
//       setUsers(mappedUsers);
//     }
//   }, [data]);

//   const handleDetailsClick = (userId: string) => {
//     const user = users.find((user) => user.id === userId);
//     if (user) {
//       setSelectedUser(user);
//       setIsModalOpen(true);
//     }
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "Active":
//         return <Badge className="bg-green-500/20 text-green-400">{status}</Badge>;
//       case "Pending":
//         return <Badge className="bg-yellow-500/20 text-yellow-400">{status}</Badge>;
//       case "Inactive":
//         return <Badge className="bg-red-500/20 text-red-400">{status}</Badge>;
//       default:
//         return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64 text-white">
//         Loading users...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64 text-red-400">
//         Error loading user data
//       </div>
//     );
//   }

//   return (
//     <div className="text-white p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold">User Management</h1>
//       </div>

//       {/* Users Table */}
//       <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
//         {/* Table Header */}
//         <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-300 bg-gray-900">
//           <div>User Name</div>
//           <div>Joining Date</div>
//           <div>Email</div>
//           <div>Phone</div>
//           <div>Shop</div>
//           <div>Area</div>
//           <div>Status</div>
//           <div>Actions</div>
//         </div>

//         {/* Table Body */}
//         <div className="divide-y divide-gray-700">
//           {users.length === 0 ? (
//             <div className="p-4 text-center text-gray-400">
//               No users found
//             </div>
//           ) : (
//             users.map((user) => (
//               <div
//                 key={user.id}
//                 className="grid grid-cols-8 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
//               >
//                 <div className="text-white font-medium">{user.userName}</div>
//                 <div className="text-gray-300 text-sm">{user.joiningDate}</div>
//                 <div className="text-gray-300 text-sm truncate">{user.emailId}</div>
//                 <div className="text-gray-300">{user.phoneNum}</div>
//                 <div className="text-gray-300 truncate">{user.shopName}</div>
//                 <div className="text-gray-300">{user.area}</div>
//                 <div>{getStatusBadge(user.status)}</div>
//                 <div className="flex items-center gap-2">
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="w-8 h-8 p-0 text-blue-400 hover:bg-blue-500/20"
//                     onClick={() => handleDetailsClick(user.id)}
//                   >
//                     <Info className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="w-8 h-8 p-0 text-red-400 hover:bg-red-500/20"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* User Details Dialog */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
//           <DialogHeader>
//             <DialogTitle>User Details</DialogTitle>
//           </DialogHeader>
//           {selectedUser && (
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 {selectedUser.image ? (
//                   <img
//                     src={selectedUser.image}
//                     alt={selectedUser.userName}
//                     className="w-16 h-16 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
//                     <span className="text-xl">
//                       {selectedUser.userName.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                 )}
//                 <div>
//                   <h3 className="text-lg font-bold">{selectedUser.userName}</h3>
//                   <div className="flex gap-2 mt-1">
//                     {getStatusBadge(selectedUser.status)}
//                     {selectedUser.isSuperuser && (
//                       <Badge className="bg-purple-500/20 text-purple-400">Admin</Badge>
//                     )}
//                     {selectedUser.isStaff && !selectedUser.isSuperuser && (
//                       <Badge className="bg-blue-500/20 text-blue-400">Staff</Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-400">Email</p>
//                   <p>{selectedUser.emailId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Phone</p>
//                   <p>{selectedUser.phoneNum}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Shop Name</p>
//                   <p>{selectedUser.shopName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Area</p>
//                   <p>{selectedUser.area}</p>
//                 </div>
//                 <div className="md:col-span-2">
//                   <p className="text-sm text-gray-400">Address</p>
//                   <p>{selectedUser.address}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Joining Date</p>
//                   <p>{selectedUser.joiningDate}</p>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button
//                   variant="outline"
//                   className="border-gray-600 hover:bg-gray-700"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Info, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllUsersQuery, useDeleteUserMutation } from "@/redux/feature/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  userName: string;
  joiningDate: string;
  emailId: string;
  phoneNum: string;
  shopName: string;
  area: string;
  address: string;
  status: "Pending" | "Inactive" | "Active";
  image: string | null;
  isStaff: boolean;
  isSuperuser: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users data from the API
  const { data, error, isLoading } = useAllUsersQuery(undefined);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    if (data?.results?.data) {
      const mappedUsers = data.results.data.map((user: any) => ({
        id: user.user_id.toString(),
        userName: user.full_name,
        joiningDate: new Date(user.date_joined).toLocaleDateString(),
        emailId: user.email,
        phoneNum: user.phone,
        shopName: user.shop_name || "N/A",
        area: user.area_name || "N/A",
        address: user.shop_address || "N/A",
        status: user.is_active
          ? "Active"
          : user.is_approved
          ? "Pending"
          : "Inactive",
        image: user.image ? `https://mehedidev.net${user.image}` : null,
        isStaff: user.is_staff,
        isSuperuser: user.is_superuser,
      }));
      setUsers(mappedUsers);
    }
  }, [data]);

  const handleDetailsClick = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDetailsModalOpen(true);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        toast({
          title: "Success",
          description: `User ${userToDelete.userName} has been deleted successfully.`,
          variant: "default",
        });
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500/20 text-green-400">{status}</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400">{status}</Badge>;
      case "Inactive":
        return <Badge className="bg-red-500/20 text-red-400">{status}</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-400">
        Error loading user data
      </div>
    );
  }

  return (
    <div className="text-white p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-300 bg-gray-900">
          <div>User Name</div>
          <div>Joining Date</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Shop</div>
          <div>Area</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No users found
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-8 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-white font-medium">{user.userName}</div>
                <div className="text-gray-300 text-sm">{user.joiningDate}</div>
                <div className="text-gray-300 text-sm truncate">{user.emailId}</div>
                <div className="text-gray-300">{user.phoneNum}</div>
                <div className="text-gray-300 truncate">{user.shopName}</div>
                <div className="text-gray-300">{user.area}</div>
                <div>{getStatusBadge(user.status)}</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 text-blue-400 hover:bg-blue-500/20"
                    onClick={() => handleDetailsClick(user.id)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 text-red-400 hover:bg-red-500/20"
                    onClick={() => handleDeleteClick(user)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.userName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xl">
                      {selectedUser.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.userName}</h3>
                  <div className="flex gap-2 mt-1">
                    {getStatusBadge(selectedUser.status)}
                    {selectedUser.isSuperuser && (
                      <Badge className="bg-purple-500/20 text-purple-400">Admin</Badge>
                    )}
                    {selectedUser.isStaff && !selectedUser.isSuperuser && (
                      <Badge className="bg-blue-500/20 text-blue-400">Staff</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p>{selectedUser.emailId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p>{selectedUser.phoneNum}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Shop Name</p>
                  <p>{selectedUser.shopName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Area</p>
                  <p>{selectedUser.area}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400">Address</p>
                  <p>{selectedUser.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Joining Date</p>
                  <p>{selectedUser.joiningDate}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700"
                  onClick={closeDetailsModal}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete {userToDelete?.userName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-black hover:bg-gray-700"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}