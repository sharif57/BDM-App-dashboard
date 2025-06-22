"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function Component() {
  const [formData, setFormData] = useState({
    mainCategory: "Best Selling",
    companyName: "WG",
    productName: "Pepsi Extra",
    quantity: "20 pcs",
    description: "",
    stock: "1015",
    netPrice: "1025",
    status: "Inactive",
    grossPrice: "1025",
    priceRegular: "1025",
    discount: "10",
  })

  const [isSmall, setIsSmall] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    console.log("Uploaded files:", uploadedFiles)
  }

  const handleRemove = () => {
    setFormData({
      mainCategory: "",
      companyName: "",
      productName: "",
      quantity: "",
      description: "",
      stock: "",
      netPrice: "",
      status: "",
      grossPrice: "",
      priceRegular: "",
      discount: "",
    })
    setUploadedFiles([])
  }

  return (
    <div className=" text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div onClick={() => window.history.back()} className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium">Add Product</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Small</span>
            <Switch
              checked={!isSmall}
              onCheckedChange={(checked) => setIsSmall(!checked)}
              className="data-[state=checked]:bg-green-500"
            />
            <span className="text-sm">Large</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#23252b] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#23252b]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Main Category */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Main Category</Label>
              <Select value={formData.mainCategory} onValueChange={(value) => handleInputChange("mainCategory", value)}>
                <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-gray-600">
                  <SelectItem value="Best Selling">Best Selling</SelectItem>
                  <SelectItem value="New Arrivals">New Arrivals</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Company Name</Label>
              <Select value={formData.companyName} onValueChange={(value) => handleInputChange("companyName", value)}>
                <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-gray-600">
                  <SelectItem value="WG">WG</SelectItem>
                  <SelectItem value="Coca Cola">Coca Cola</SelectItem>
                  <SelectItem value="Pepsi">Pepsi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Product Name</Label>
              <Input
                value={formData.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Pepsi Extra"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Quantity</Label>
              <Input
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-500"
                placeholder="20 pcs"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Add Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-300">Add New</Label>
                <Label className="text-sm text-gray-300">Add Photo</Label>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-green-500 bg-green-500/10" : "border-gray-600 hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                  <p className="text-sm text-gray-400">Or drag and drop files</p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#2a2a2a] p-2 rounded">
                      <span className="text-sm text-gray-300">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock and Net Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Stock</Label>
                <Input
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className="bg-[#2a2a2a] border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Net Price</Label>
                <Input
                  value={formData.netPrice}
                  onChange={(e) => handleInputChange("netPrice", e.target.value)}
                  className="bg-[#2a2a2a] border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Status and Gross Price Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-gray-600">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Gross Price</Label>
                <Input
                  value={formData.grossPrice}
                  onChange={(e) => handleInputChange("grossPrice", e.target.value)}
                  className="bg-[#2a2a2a] border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Price Regular */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Price ( Regular )</Label>
              <Input
                value={formData.priceRegular}
                onChange={(e) => handleInputChange("priceRegular", e.target.value)}
                className="bg-[#2a2a2a] border-gray-600 text-white"
              />
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Discount / Range (%)</Label>
              <Input
                value={formData.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                className="bg-[#2a2a2a] border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleRemove}
            className="px-8 py-2 border-gray-600 rounded-full bg-black text-white hover:bg-gray-700"
          >
            Remove
          </Button>
          <Button onClick={handleSubmit} className="px-8 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white">
            Add Now
          </Button>
        </div>
      </div>
    </div>
  )
}
