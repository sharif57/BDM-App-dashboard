"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Component() {
  const [notice, setNotice] = useState("All orders placed before 3:00 PM will be processed on the same day")
  const [editNotice, setEditNotice] = useState("")
  const [newNotice, setNewNotice] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleEditNotice = () => {
    setEditNotice(notice)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    setNotice(editNotice)
    setIsEditDialogOpen(false)
    setEditNotice("")
  }

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false)
    setEditNotice("")
  }

  const handleDeleteNotice = () => {
    setNotice("")
  }

  const handleAddNotice = () => {
    setIsAddDialogOpen(true)
  }

  const handleSaveNewNotice = () => {
    if (newNotice.trim()) {
      setNotice(newNotice)
      setIsAddDialogOpen(false)
      setNewNotice("")
    }
  }

  const handleCancelAdd = () => {
    setIsAddDialogOpen(false)
    setNewNotice("")
  }

  return (
    <div className=" text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium">Your Notice</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-start justify-start min-h-[60vh]">
        {/* Notice Card */}
        {notice && (
          <div className="bg-[#2a2a2a] rounded-lg p-8 mb-8 max-w-2xl h-[200px] w-full flex items-center justify-center text-center">
            <p className="text-white text-lg leading-relaxed">{notice}</p>
          </div>
        )}

        {!notice && (
          <div className="bg-[#2a2a2a] rounded-lg p-8 mb-8 max-w-md w-full text-center">
            <p className="text-gray-400 text-lg">No notice available</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md ">
          {/* Edit Notice Button */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={handleEditNotice}
                disabled={!notice}
                className="w-full py-3 bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2a2a2a] border-gray-600 text-white">
              <DialogHeader>
                <DialogTitle>Edit Notice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={editNotice}
                  onChange={(e) => setEditNotice(e.target.value)}
                  placeholder="Enter your notice..."
                  className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 min-h-[100px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Notice Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={!notice}
                className="w-full py-3 bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Notice
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#2a2a2a] border-gray-600 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  Are you sure you want to delete this notice? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteNotice} className="bg-red-500 hover:bg-red-600 text-white">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Add Notice Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddNotice}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#2a2a2a] border-gray-600 text-white">
              <DialogHeader>
                <DialogTitle>Add New Notice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={newNotice}
                  onChange={(e) => setNewNotice(e.target.value)}
                  placeholder="Enter your notice..."
                  className="bg-[#1a1a1a] border-gray-600 text-white placeholder:text-gray-500 min-h-[100px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleCancelAdd}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveNewNotice}
                    disabled={!newNotice.trim()}
                    className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                  >
                    Add Notice
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
