"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddAreaForm() {
  const [areaNames, setAreaNames] = useState(["Mohammadpur", "Gulshan", "", "", ""])
  const router = useRouter();

  const handleInputChange = (index: number, value: string) => {
    const updatedAreas = [...areaNames]
    updatedAreas[index] = value
    setAreaNames(updatedAreas)
  }

  const handleSave = () => {
    const filledAreas = areaNames.filter((name) => name.trim() !== "")
    console.log("Saving areas:", filledAreas)
    // Here you would typically send the data to your backend
    alert(`Saved ${filledAreas.length} areas successfully!`)
  }

  const handleBack = () => {

    router.back();

    console.log("Going back to area list")
    // Here you would typically navigate back to the previous page
  }

  return (
    <div className=" p-6">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-white hover:bg-gray-700 p-2 mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-xl font-medium">Add Area</h1>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-4">Area Name</label>

            <div className="space-y-4">
              {areaNames.map((name, index) => (
                <Input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Write here"
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500 h-12 px-4 rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-full text-base font-medium"
            >
              Save Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
