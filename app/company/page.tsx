
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAllCompaniesQuery, useDeleteCompanyMutation, useUpdateCompanyMutation } from "@/redux/feature/companySlice";
import Link from "next/link";

interface Company {
    company_id: number;
    company_name: string;
    logo: string;
    is_active: boolean;
    created_on: string;
    updated_on: string;
}

export default function Component() {
    const { data, refetch } = useAllCompaniesQuery(undefined);
    console.log(data?.data, 'data');
    const [updateCompany] = useUpdateCompanyMutation();

    const [deleteCompany] = useDeleteCompanyMutation();

    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [newStatus, setNewStatus] = useState<"Active" | "Inactive">("Active");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null); // State to hold the new logo file

    const handleEditClick = (company: Company) => {
        setSelectedCompany(company);
        setNewStatus(company.is_active ? "Active" : "Inactive");
        setIsModalOpen(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setLogoFile(event.target.files[0]);
        }
    };

    const handleStatusUpdate = async () => {
        if (selectedCompany) {
            const formData = new FormData();
            formData.append("company_name", selectedCompany.company_name || "SUN PHARMACEUTICAL2");
            if (logoFile) {
                formData.append("logo", logoFile);
            }
            formData.append("is_active", newStatus === "Active" ? "true" : "false");

            try {
                await updateCompany({
                    id: selectedCompany.company_id,
                    data: formData,
                }).unwrap();
                toast.success("Company updated successfully!", {
                    position: "top-right",
                });
                refetch(); // Refresh the company list
                setIsModalOpen(false);
                setSelectedCompany(null);
                setLogoFile(null); // Reset logo file
            } catch (error) {
                console.error("Error updating company:", error);
                toast.error("Failed to update company!", {
                    position: "top-right",
                });
            }
        }
    };

    return (
        <div className="pt-4">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-medium">Company</h1>
                    <Link href={'company/create_company'}>
                        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Add New</Button>
                    </Link>
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
                            {data?.data.map((company: any, index: number) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-750">
                                    <td className="py-4 px-6 text-gray-300">{company.company_id}</td>
                                    <td className="py-4 px-6 text-white">{company.company_name}</td>
                                    <td className="py-4 px-6">
                                        <span className={`text-sm ${company.is_active ? "text-green-400" : "text-red-400"}`}>
                                            {company.is_active ? "Active" : "Inactive"}
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
                                                onClick={async () => {
                                                    try {
                                                        await deleteCompany({ id: company.company_id }).unwrap();
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
                                <input
                                    type="text"
                                    value={selectedCompany?.company_name || ""}
                                    onChange={(e) => setSelectedCompany(prev => prev ? { ...prev, company_name: e.target.value } : null)}
                                    className="w-full bg-gray-700 px-3 py-2 rounded-md text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block">Logo</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-700 px-3 py-2 rounded-md text-white"
                                />
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
    );
}