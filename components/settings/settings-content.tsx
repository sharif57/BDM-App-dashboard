'use client';
import { useUpdateProfileMutation, useUserProfileQuery } from '@/redux/feature/userSlice';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import Info from '../info';

export default function MyProfile() {
  const { data: profileData, isLoading, isError, refetch } = useUserProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    shop_name: "",
    shop_address: "",
    image: "",
    is_active: true,
    is_staff: false,
    is_superuser: false
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const IMAGE_BASE_URL = 'http://147.93.104.182:8000';

  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        shop_name: profileData.shop_name || "",
        shop_address: profileData.shop_address || "",
        image: profileData.image || "",
        is_active: profileData.is_active || false,
        is_staff: profileData.is_staff || false,
        is_superuser: profileData.is_superuser || false
      });
    }
  }, [profileData]);

  const handleProfileChange = (key: string, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("full_name", profile.full_name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("shop_name", profile.shop_name);
      formData.append("shop_address", profile.shop_address);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      setEditMode(false);
      setSelectedImage(null);
      setPreviewImage(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Error loading profile data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Profile Image Section */}
            <div className="md:w-1/3 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4">
                {profile.image || previewImage ? (
                  <Image
                    src={previewImage || `${IMAGE_BASE_URL}${profile.image}`}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">{profile.full_name}</h2>
              <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>

            {/* Profile Details Section */}
            <div className="md:w-2/3 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Full Name</h3>
                    <p className="mt-1 text-lg text-gray-800">{profile.full_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Email</h3>
                    <p className="mt-1 text-lg text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</h3>
                    <p className="mt-1 text-lg text-gray-800">{profile.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Shop Name</h3>
                    <p className="mt-1 text-lg text-gray-800">{profile.shop_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Shop Address</h3>
                    <p className="mt-1 text-lg text-gray-800">{profile.shop_address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</h3>
                    <div className="mt-1 flex space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {profile.is_staff && (
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          Staff
                        </span>
                      )}
                      {profile.is_superuser && (
                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                    {previewImage || profile.image ? (
                      <Image
                        src={previewImage || `${IMAGE_BASE_URL}${profile.image}`}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-image"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Change Image
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => handleProfileChange('full_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={profile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Name
                    </label>
                    <input
                      id="shop_name"
                      type="text"
                      value={profile.shop_name}
                      onChange={(e) => handleProfileChange('shop_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shop_address" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Address
                  </label>
                  <textarea
                    id="shop_address"
                    value={profile.shop_address}
                    onChange={(e) => handleProfileChange('shop_address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.is_active}
                      onChange={(e) => handleProfileChange('is_active', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.is_staff}
                      onChange={(e) => handleProfileChange('is_staff', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Staff</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.is_superuser}
                      onChange={(e) => handleProfileChange('is_superuser', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Admin</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setPreviewImage(null);
                    setSelectedImage(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Info />
    </div>
  );
}