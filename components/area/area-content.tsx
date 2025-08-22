
// "use client";

// import { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
// import Link from "next/link";
// import {
//   useAreaListQuery,
//   useDeleteAreaMutation,
//   useUpdateAreaMutation,
// } from "@/redux/feature/areaSlice";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Tooltip } from "../ui/tooltip";

// interface AreaData {
//   id: string;
//   name: string;
//   status: "Active" | "Inactive";
// }

// export default function AreaContent() {
//   const { data, isLoading } = useAreaListQuery(undefined);
//   const [updateArea] = useUpdateAreaMutation();
//   const [deleteArea] = useDeleteAreaMutation();
//   // Transform API data to match AreaData interface
//   const apiAreas: AreaData[] =
//     data?.data?.map((area: any) => ({
//       id: area.area_id,
//       name: area.area_name,
//       status: area.is_active ? "Active" : "Inactive",
//     })) || [];

//   const [currentPage, setCurrentPage] = useState(1);
//   const [localAreas, setLocalAreas] = useState<AreaData[]>([]); // for status toggle only
//   const [editArea, setEditArea] = useState<AreaData | null>(null); // Area to be edited

//   const handleStatusChange = (
//     index: number,
//     newStatus: "Active" | "Inactive"
//   ) => {
//     const updated = [...(localAreas.length ? localAreas : apiAreas)];
//     updated[index].status = newStatus;
//     setLocalAreas(updated);
//   };

//   const handleEdit = (index: number) => {
//     const target = (localAreas.length ? localAreas : apiAreas)[index];
//     setEditArea(target); // Set the area to edit
//   };



//   const handleAddNew = () => {
//     console.log("Add new area");
//   };

//   const handleUpdateArea = async (id: string) => {
//     if (editArea) {
//       try {
//         // Ensure id is set and log the API URL
//         console.log("Updating area with ID:", editArea.id); // Log the ID

//         const updatedArea = {
//           id: editArea.id, // Ensure id is always a string
//           area_name: editArea.name,
//           is_active: editArea.status === "Active", // Send status as boolean
//         };
//         console.log("Updated Area:", updatedArea);

//         console.log("Request Payload:", updatedArea); // Log the request payload

//         // Send the updated area to the backend
//       const response =  await updateArea({ updatedArea }).unwrap();
//       console.log(response, 'response')

      

//         // Close the dialog after update
//         setEditArea(null);

//         alert("Area updated successfully!");
//       } catch (error) {
//         console.error("Error updating area:", error);
//         alert("Failed to update area.");
//       }
//     }
//   };

//   const displayedAreas = localAreas.length ? localAreas : apiAreas;

//   return (
//     <div className="w-full p-6">
//       <div className="w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">

//           <h1 className="text-white text-xl font-medium " title="Area">Area</h1>
   
//           <Link href={"add-area-form"}>
//             <Button
//               onClick={handleAddNew}
//               className="bg-[#44B46E] hover:bg-green-700 text-white px-6 py-2 rounded-full"
//             >
//               Add New
//             </Button>
//           </Link>
//         </div>

//         {/* Table */}
//         <div className="bg-[#23252b] w-full rounded-lg overflow-hidden">
//           <div className="grid grid-cols-4 gap-4 p-4 bg-gray-600 text-white text-sm font-medium">
//             <div>Area ID</div>
//             <div>Area Name</div>
//             <div>Status</div>
//             <div>Action</div>
//           </div>

//           <div className="divide-y divide-gray-600">
//             {isLoading ? (
//               <div className="p-4 text-white">Loading...</div>
//             ) : (
//               displayedAreas.map((area, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-4 gap-4 p-4 items-center"
//                 >
//                   <div className="text-white text-sm">{area.id}</div>
//                   <div className="text-white text-sm">{area.name}</div>
//                   <div>
//                     <Select
//                       value={area.status}
//                       onValueChange={(value: "Active" | "Inactive") =>
//                         handleStatusChange(index, value)
//                       }
//                     >
//                       <SelectTrigger
//                         className={`w-24 h-8 text-xs border-none ${
//                           area.status === "Active"
//                             ? "bg-green-600 text-white"
//                             : "bg-red-600 text-white"
//                         }`}
//                       >
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Active">Active</SelectItem>
//                         <SelectItem value="Inactive">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={() => handleEdit(index)}
//                       size="sm"
//                       className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
//                     >
//                       <Edit className="w-3 h-3" />
//                     </Button>

//                     <Button
//                       onClick={async () => {
//                         try {
//                           await deleteArea(area.id);
//                           toast.success("Area deleted successfully!", {
//                             position: "top-right",
//                           });
//                         } catch (error) {
//                           toast.error("Failed to delete area!", {
//                             position: "top-right",
//                           });
//                         }
//                       }}
//                       size="sm"
//                       className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 p-0"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Pagination (dummy for now) */}
//         <div className="flex justify-center items-center mt-6 gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-700"
//             onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </Button>

//           <Button
//             size="sm"
//             className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
//           >
//             {currentPage}
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-white hover:bg-gray-700"
//             onClick={() => setCurrentPage(currentPage + 1)}
//           >
//             <ChevronRight className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Edit Area Dialog */}
//       <Dialog open={editArea !== null}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Area</DialogTitle>
//             <DialogDescription>Update the area details</DialogDescription>
//           </DialogHeader>

//           {editArea && (
//             <div>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="areaName">Area Name</Label>
//                   <Input
//                     id="areaName"
//                     value={editArea.name}
//                     onChange={(e) =>
//                       setEditArea((prev) => ({
//                         ...prev!,
//                         name: e.target.value,
//                       }))
//                     }
//                     placeholder="Enter area name"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="status">Status</Label>
//                   <Select
//                     value={editArea.status}
//                     onValueChange={(value: "Active" | "Inactive") =>
//                       setEditArea((prev) => ({
//                         ...prev!,
//                         status: value,
//                       }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Active">Active</SelectItem>
//                       <SelectItem value="Inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//           )}

//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="secondary">
//                 Close
//               </Button>
//             </DialogClose>
//             <Button onClick={handleUpdateArea}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useAreaListQuery,
  useDeleteAreaMutation,
  useUpdateAreaMutation,
} from "@/redux/feature/areaSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AreaData {
  id: string;
  name: string;
  status: "Active" | "Inactive";
}

export default function AreaContent() {
  const { data, isLoading } = useAreaListQuery(undefined);
  const [updateArea] = useUpdateAreaMutation();
  const [deleteArea] = useDeleteAreaMutation();

  // Transform API data to match AreaData interface
  const apiAreas: AreaData[] =
    data?.data?.map((area: any) => ({
      id: area.area_id,
      name: area.area_name,
      status: area.is_active ? "Active" : "Inactive",
    })) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const [localAreas, setLocalAreas] = useState<AreaData[]>([]);
  const [editArea, setEditArea] = useState<AreaData | null>(null);

  const handleStatusChange = (
    index: number,
    newStatus: "Active" | "Inactive"
  ) => {
    const updated = [...(localAreas.length ? localAreas : apiAreas)];
    updated[index].status = newStatus;
    setLocalAreas(updated);
  };

  const handleEdit = (index: number) => {
    const target = (localAreas.length ? localAreas : apiAreas)[index];
    setEditArea(target);
  };

  const handleAddNew = () => {
    console.log("Add new area");
  };

  const handleUpdateArea = async () => {
    if (editArea) {
      try {
        const updatedArea = {
          area_name: editArea.name,
          is_active: editArea.status === "Active",
        };

        console.log("Updating area with ID:", editArea.id);
        console.log("Request Payload:", updatedArea);

        // Call the updateArea mutation with proper structure
        const response = await updateArea({
          id: editArea.id, // Pass the ID separately
          data: updatedArea, // Pass the data separately
        }).unwrap();

        console.log("Update response:", response);

        toast.success("Area updated successfully!", {
          position: "top-right",
        });

        // Close the dialog after update
        setEditArea(null);
      } catch (error) {
        console.error("Error updating area:", error);
        toast.error("Failed to update area!", {
          position: "top-right",
        });
      }
    }
  };

  const handleCloseDialog = () => {
    setEditArea(null); // Close the dialog by resetting editArea
  };

  const displayedAreas = localAreas.length ? localAreas : apiAreas;

  return (
    <div className="w-full p-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-xl font-medium" title="Area">
            Area
          </h1>
          <Link href={"add-area-form"}>
            <Button
              onClick={handleAddNew}
              className="bg-[#44B46E] hover:bg-green-700 text-white px-6 py-2 rounded-full"
            >
              Add New
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-[#23252b] w-full rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-600 text-white text-sm font-medium">
            <div>Area ID</div>
            <div>Area Name</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="divide-y divide-gray-600">
            {isLoading ? (
              <div className="p-4 text-white">Loading...</div>
            ) : (
              displayedAreas.map((area, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 p-4 items-center"
                >
                  <div className="text-white text-sm">{area.id}</div>
                  <div className="text-white text-sm">{area.name}</div>
                  <div className="text-white text-sm">{area.status}</div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(index)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    <Button
                      onClick={async () => {
                        try {
                          await deleteArea(area.id);
                          toast.success("Area deleted successfully!", {
                            position: "top-right",
                          });
                        } catch (error) {
                          toast.error("Failed to delete area!", {
                            position: "top-right",
                          });
                        }
                      }}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
          >
            {currentPage}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Edit Area Dialog */}
      <Dialog open={editArea !== null} onOpenChange={setEditArea ? () => setEditArea(null) : undefined}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Area</DialogTitle>
            <DialogDescription>Update the area details</DialogDescription>
          </DialogHeader>

          {editArea && (
            <div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="areaName">Area Name</Label>
                  <Input
                    id="areaName"
                    value={editArea.name}
                    onChange={(e) =>
                      setEditArea((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter area name"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editArea.status}
                    onValueChange={(value: "Active" | "Inactive") =>
                      setEditArea((prev) => ({
                        ...prev!,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateArea}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}