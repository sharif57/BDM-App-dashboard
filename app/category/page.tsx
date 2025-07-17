"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useAllCategoriesQuery, useDeleteCategoryMutation } from "@/redux/feature/categorieSlice"
import { toast } from "sonner"

interface Company {
  id: string
  name: string
  status: "Active" | "Inactive"
}

export default function Component() {
  const { data ,refetch} = useAllCategoriesQuery(undefined)
  console.log(data?.data, 'data')
  const [deleteCategory] = useDeleteCategoryMutation()


  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [newStatus, setNewStatus] = useState<"Active" | "Inactive">("Active")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company)
    setNewStatus(company.status)
    setIsModalOpen(true)
  }

  const handleStatusUpdate = () => {
    if (selectedCompany) {

      setIsModalOpen(false)
      setSelectedCompany(null)
    }
  }



  return (
    <div className=" pt-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">Company</h1>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Add New</Button>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-6 font-medium text-gray-300">Company ID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-300">Company Name</th>
                <th className="text-left py-4 px-6 font-medium text-gray-300">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((company : any, index: number) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-4 px-6 text-gray-300">{company.category_id}</td>
                  <td className="py-4 px-6 text-white">{company.name}</td>
                  <td className="py-4 px-6">
                    <span className={`text-sm ${company.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                      {company.is_active}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-600 hover:bg-green-700 border-green-600 text-white p-2 h-8 w-8"
                        onClick={() => handleEditClick(company)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button


                        // onClick={() => handleDelete(company.category_id)}
                        onClick={async () => {
                          try {
                            await deleteCategory({id:company.category_id}).unwrap();
                            toast.success("Area deleted successfully!", {
                              position: "top-right",
                            });
                            refetch();
                          } catch (error) {
                            toast.error("Failed to delete area!", {
                              position: "top-right",
                            });
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="bg-red-600 hover:bg-red-700 border-red-600 text-white p-2 h-8 w-8"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white min-w-8">
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 min-w-8"
          >
            2
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Update Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Update Company Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Company Name</label>
                <div className="text-white bg-gray-700 px-3 py-2 rounded-md">{selectedCompany?.name}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
                <Select value={newStatus} onValueChange={(value: "Active" | "Inactive") => setNewStatus(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="Active" className="text-white hover:bg-gray-600">
                      Active
                    </SelectItem>
                    <SelectItem value="Inactive" className="text-white hover:bg-gray-600">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate} className="bg-green-600 hover:bg-green-700 text-white">
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
