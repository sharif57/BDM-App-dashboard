// import React from 'react'

// export default function AreaContent() {
//   return (
//     <div>area-content</div>
//   )
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface AreaData {
  id: string;
  name: string;
  status: "Active" | "Inactive";
}

export default function AreaContent() {
  const [areas, setAreas] = useState<AreaData[]>([
    { id: "#12345", name: "Mohammadpur", status: "Active" },
    { id: "#12345", name: "Dhanmondi", status: "Inactive" },
    { id: "#12345", name: "Mohammadpur", status: "Active" },
    { id: "#12345", name: "Mohammadpur", status: "Active" },
    { id: "#12345", name: "Mohammadpur", status: "Active" },
    { id: "#12345", name: "Mohammadpur", status: "Active" },
    { id: "#12345", name: "Mohammadpur", status: "Active" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusChange = (
    index: number,
    newStatus: "Active" | "Inactive"
  ) => {
    const updatedAreas = [...areas];
    updatedAreas[index].status = newStatus;
    setAreas(updatedAreas);
  };

  const handleEdit = (index: number) => {
    console.log("Edit area:", areas[index]);
  };

  const handleDelete = (index: number) => {
    const updatedAreas = areas.filter((_, i) => i !== index);
    setAreas(updatedAreas);
  };

  const handleAddNew = () => {
    console.log("Add new area");
  };

  return (
    <div className="0 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-xl font-medium">Area</h1>
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
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-600 text-white text-sm font-medium">
            <div>Area ID</div>
            <div>Area Name</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-600">
            {areas.map((area, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-4 items-center"
              >
                <div className="text-white text-sm">{area.id}</div>
                <div className="text-white text-sm">{area.name}</div>
                <div>
                  <Select
                    value={area.status}
                    onValueChange={(value: "Active" | "Inactive") =>
                      handleStatusChange(index, value)
                    }
                  >
                    <SelectTrigger
                      className={`w-24 h-8 text-xs border-none ${
                        area.status === "Active"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(index)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(index)}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
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
    </div>
  );
}
