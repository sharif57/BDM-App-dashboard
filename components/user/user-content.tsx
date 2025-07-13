"use client";

import { useState, useEffect } from "react";
import { Check, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { useAllUsersQuery } from "@/redux/feature/userSlice"; // Assuming this is your custom hook for API call

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
}

export default function Component() {
  const [users, setUsers] = useState<User[]>([]); // State to store the fetched users
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State to manage selected user
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Fetch users data from the API (using custom hook or fetch)
  const { data, error, isLoading } = useAllUsersQuery(undefined); // Assuming this is the custom API query hook

  useEffect(() => {
    if (data) {
      // Map the response data to the structure needed for the users state
      const mappedUsers = data?.data?.map((user: any) => ({
        id: user.user_id,
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
      }));
      setUsers(mappedUsers); // Update the users state with fetched data
    }
  }, [data]);

  const handleDetailsClick = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user); // Set the selected user for the modal
      setIsModalOpen(true); // Open the modal
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  if (error) {
    return <div>Error loading data</div>; // Show an error message if the data fetch fails
  }

  return (
    <div className="text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">User Details</h1>
      </div>

      {/* Table */}
      <div className="bg-[#23252b] rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-4 p-4 border-b border-gray-600 text-sm font-medium text-gray-300">
          <div>User Name</div>
          <div>Joining Date</div>
          <div>Email ID</div>
          <div>Phone Num</div>
          <div>Shop Name</div>
          <div>Area</div>
          <div>Address</div>
          {/* <div>Status</div> */}
          <div>Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-600">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-8 gap-4 p-4 items-center hover:bg-gray-700/50 transition-colors"
            >
              <div className="text-white">{user.userName}</div>
              <div className="text-gray-300">{user.joiningDate}</div>
              <div className="text-gray-300 text-sm">{user.emailId}</div>
              <div className="text-gray-300">{user.phoneNum}</div>
              <div className="text-gray-300">{user.shopName}</div>
              <div className="text-gray-300">{user.area}</div>
              <div className="text-gray-300">{user.address}</div>
              {/* <div>
                <Select value={user.status}>
                  <SelectContent className="bg-[#2a2a2a] border-gray-600">
                    <SelectItem value="Pending" className="text-red-400">
                      Pending
                    </SelectItem>
                    <SelectItem value="Inactive" className="text-gray-400">
                      Inactive
                    </SelectItem>
                    <SelectItem value="Active" className="text-green-400">
                      Active
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div className="flex items-center gap-2">
                  {/* <Button
                    size="sm"
                    className="w-8 h-8 p-0 bg-green-500 hover:bg-green-600 rounded-full"
                    onClick={() => handleDetailsClick(user.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button> */}
                <Button
                  size="sm"
                  className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full"
                  onClick={() => handleDetailsClick(user.id)}
                >
                  <Info className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#23252b] p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold">User Details</h3>
            <p>
              <strong>Name:</strong> {selectedUser.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.emailId}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser.phoneNum}
            </p>
            <p>
              <strong>Shop Name:</strong> {selectedUser.shopName}
            </p>
            <p>
              <strong>Area:</strong> {selectedUser.area}
            </p>
            <p>
              <strong>Address:</strong> {selectedUser.address}
            </p>
            <p>
              <strong>Status:</strong> {selectedUser.status}
            </p>

            {/* Close Button */}
            <Button className="mt-4 w-full" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
