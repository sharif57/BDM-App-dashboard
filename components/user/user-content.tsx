
// "use client";

// import { useState, useEffect } from "react";
// import { Info, Trash2, X, Edit2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAllUsersQuery, useDeleteUserMutation, useUpdateUsersMutation } from "@/redux/feature/userSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "@/components/ui/use-toast";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAreaListQuery } from "@/redux/feature/areaSlice";

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
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);
//   const [editForm, setEditForm] = useState({
//     userName: "",
//     emailId: "",
//     phoneNum: "",
//     shopName: "",
//     area: "",
//     address: "",
//     status: "Pending" as "Pending" | "Inactive" | "Active",
//     isStaff: false,
//     isSuperuser: false,
//   });

//   const { data, error, isLoading } = useAllUsersQuery(undefined);
//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
//   const [updateUsers, { isLoading: isUpdating }] = useUpdateUsersMutation();


//   const {data: area} = useAreaListQuery(undefined);

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
//       setIsDetailsModalOpen(true);
//     }
//   };

//   const handleEditClick = (user: User) => {
//     setSelectedUser(user);
//     setEditForm({
//       userName: user.userName,
//       emailId: user.emailId,
//       phoneNum: user.phoneNum,
//       shopName: user.shopName,
//       area: user.area,
//       address: user.address,
//       status: user.status,
//       isStaff: user.isStaff,
//       isSuperuser: user.isSuperuser,
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleEditSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedUser) {
//       try {
//         const formData = new FormData();
//         formData.append("full_name", editForm.userName);
//         formData.append("email", editForm.emailId);
//         formData.append("phone", editForm.phoneNum);
//         formData.append("shop_name", editForm.shopName);
//         formData.append("area_name", editForm.area);
//         formData.append("shop_address", editForm.address);
//         formData.append("is_active", editForm.status === "Active" ? "true" : "false");
//         formData.append("is_approved", editForm.status === "Pending" ? "true" : "false");
//         formData.append("is_staff", editForm.isStaff.toString());
//         formData.append("is_superuser", editForm.isSuperuser.toString());

//         await updateUsers({ id: selectedUser.id, data: formData }).unwrap();
//         toast({
//           title: "Success",
//           description: `User ${editForm.userName} updated successfully.`,
//         });

//         // Update local state
//         setUsers(users.map((user) =>
//           user.id === selectedUser.id
//             ? { ...user, ...editForm }
//             : user
//         ));
//         setIsEditModalOpen(false);
//         setSelectedUser(null);
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to update user. Please try again.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const handleDeleteClick = (user: User) => {
//     setUserToDelete(user);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (userToDelete) {
//       try {
//         await deleteUser(userToDelete.id).unwrap();
//         toast({
//           title: "Success",
//           description: `User ${userToDelete.userName} has been deleted successfully.`,
//           variant: "default",
//         });
//         setUsers(users.filter((user) => user.id !== userToDelete.id));
//         setIsDeleteModalOpen(false);
//         setUserToDelete(null);
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to delete user. Please try again.",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const closeDetailsModal = () => {
//     setIsDetailsModalOpen(false);
//     setSelectedUser(null);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedUser(null);
//   };

//   const closeDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setUserToDelete(null);
//   };

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
//                     className="w-8 h-8 p-0 text-yellow-400 hover:bg-yellow-500/20"
//                     onClick={() => handleEditClick(user)}
//                   >
//                     <Edit2 className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="w-8 h-8 p-0 text-red-400 hover:bg-red-500/20"
//                     onClick={() => handleDeleteClick(user)}
//                     disabled={isDeleting}
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
//       <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
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
//                   className="border-gray-600 text-black hover:bg-gray-700"
//                   onClick={closeDetailsModal}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Edit User Dialog */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleEditSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="userName">User Name</Label>
//                 <Input
//                   id="userName"
//                   value={editForm.userName}
//                   onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
//                   className="bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="emailId">Email</Label>
//                 <Input
//                   id="emailId"
//                   type="email"
//                   value={editForm.emailId}
//                   onChange={(e) => setEditForm({ ...editForm, emailId: e.target.value })}
//                   className="bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phoneNum">Phone</Label>
//                 <Input
//                   id="phoneNum"
//                   value={editForm.phoneNum}
//                   onChange={(e) => setEditForm({ ...editForm, phoneNum: e.target.value })}
//                   className="bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="shopName">Shop Name</Label>
//                 <Input
//                   id="shopName"
//                   value={editForm.shopName}
//                   onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })}
//                   className="bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="area">Area</Label>
//                 <Input
//                   id="area"
//                   value={editForm.area}
//                   onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
//                   className="bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Input
//                   id="address"
//                   value={editForm.address}
//                   onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
//                   className="bg-gray-700 text-white border-gray-600"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <Select
//                   value={editForm.status}
//                   onValueChange={(value: "Pending" | "Inactive" | "Active") =>
//                     setEditForm({ ...editForm, status: value })
//                   }
//                 >
//                   <SelectTrigger className="bg-gray-700 text-white border-gray-600">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-gray-700 text-white border-gray-600">
//                     <SelectItem value="Active">Active</SelectItem>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="isStaff"
//                     checked={editForm.isStaff}
//                     onChange={(e) => setEditForm({ ...editForm, isStaff: e.target.checked })}
//                     className="mr-2"
//                   />
//                   <Label htmlFor="isStaff">Staff</Label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="isSuperuser"
//                     checked={editForm.isSuperuser}
//                     onChange={(e) => setEditForm({ ...editForm, isSuperuser: e.target.checked })}
//                     className="mr-2"
//                   />
//                   <Label htmlFor="isSuperuser">Superuser</Label>
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 className="border-gray-600 text-black hover:bg-gray-700"
//                 onClick={closeEditModal}
//                 disabled={isUpdating}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isUpdating}>
//                 {isUpdating ? "Updating..." : "Update"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//         <DialogContent className="bg-gray-800 border-gray-700 text-white">
//           <DialogHeader>
//             <DialogTitle>Confirm Delete</DialogTitle>
//             <DialogDescription className="text-gray-300">
//               Are you sure you want to delete {userToDelete?.userName}? This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               className="border-gray-600 text-black hover:bg-gray-700"
//               onClick={closeDeleteModal}
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDeleteConfirm}
//               disabled={isDeleting}
//             >
//               {isDeleting ? "Deleting..." : "Delete"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Info, Trash2, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllUsersQuery, useDeleteUserMutation, useUpdateUsersMutation } from "@/redux/feature/userSlice";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAreaListQuery } from "@/redux/feature/areaSlice";

interface Area {
  area_id: number;
  area_name: string;
  is_active: boolean;
}

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
  isApproved: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    userName: "",
    emailId: "",
    phoneNum: "",
    shopName: "",
    area: "",
    address: "",
    status: "Pending" as "Pending" | "Inactive" | "Active",
    isStaff: false,
    isSuperuser: false,
    isApproved: false,
    password: "",
  });

  const { data, error, isLoading } = useAllUsersQuery(undefined);
  console.log(data,'user data')
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUsers, { isLoading: isUpdating }] = useUpdateUsersMutation();
  const { data: areaData } = useAreaListQuery(undefined);

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
        isApproved: user.is_approved,
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

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      userName: user.userName,
      emailId: user.emailId,
      phoneNum: user.phoneNum,
      shopName: user.shopName,
      area: user.area,
      address: user.address,
      status: user.status,
      isStaff: user.isStaff,
      isSuperuser: user.isSuperuser,
      isApproved: user.isApproved,
      password: "",

    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const formData = new FormData();
        formData.append("full_name", editForm.userName);
        formData.append("email", editForm.emailId);
        formData.append("phone", editForm.phoneNum);
        formData.append("shop_name", editForm.shopName);
        formData.append("area_name", editForm.area);
        formData.append("shop_address", editForm.address);
        formData.append("is_active", editForm.status === "Active" ? "true" : "false");
        formData.append("is_approved", editForm.isApproved.toString());
        formData.append("is_staff", editForm.isStaff.toString());
        formData.append("is_superuser", editForm.isSuperuser.toString());
        formData.append('password', editForm.password.toString());


        await updateUsers({ id: selectedUser.id, data: formData }).unwrap();
        toast({
          title: "Success",
          description: `User ${editForm.userName} updated successfully.`,
        });

        setUsers(users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, ...editForm }
            : user
        ));
        setIsEditModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update user. Please try again.",
          variant: "destructive",
        });
      }
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

  const closeEditModal = () => {
    setIsEditModalOpen(false);
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
                    className="w-8 h-8 p-0 text-yellow-400 hover:bg-yellow-500/20"
                    onClick={() => handleEditClick(user)}
                  >
                    <Edit2 className="h-4 w-4" />
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
                    <Badge className={selectedUser.isApproved ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {selectedUser.isApproved ? "Approved" : "Not Approved"}
                    </Badge>
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
                  className="border-gray-600 text-black hover:bg-gray-700"
                  onClick={closeDetailsModal}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userName">User Name</Label>
                <Input
                  id="userName"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="emailId">Email</Label>
                <Input
                  id="emailId"
                  type="email"
                  value={editForm.emailId}
                  onChange={(e) => setEditForm({ ...editForm, emailId: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="phoneNum">Phone</Label>
                <Input
                  id="phoneNum"
                  value={editForm.phoneNum}
                  onChange={(e) => setEditForm({ ...editForm, phoneNum: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  value={editForm.shopName}
                  onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Select
                    value={editForm.area}
                    onValueChange={(value) => setEditForm({ ...editForm, area: value })}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {areaData?.data?.map((area: Area) => (
                        <SelectItem key={area.area_id} value={area.area_name}>
                          {area.area_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* change password */}
                <div>
                      <label htmlFor="changePassword">Change Password</label>
                      <Input
                        id="password"
                        type="number"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                </div>

                <div>

                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value: "Pending" | "Inactive" | "Active") =>
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isStaff"
                    checked={editForm.isStaff}
                    onChange={(e) => setEditForm({ ...editForm, isStaff: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="isStaff">Staff</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSuperuser"
                    checked={editForm.isSuperuser}
                    onChange={(e) => setEditForm({ ...editForm, isSuperuser: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="isSuperuser">Superuser</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={editForm.isApproved}
                    onChange={(e) => setEditForm({ ...editForm, isApproved: e.target.checked })}
                    className="mr-2"
                  />
                  <Label htmlFor="isApproved">Approved</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-gray-600 text-black hover:bg-gray-700"
                onClick={closeEditModal}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
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