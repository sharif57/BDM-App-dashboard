'use client'
import { useSettingDataQuery, useUpdateSettingMutation } from '@/redux/feature/userSlice'
import React, { useState, useEffect } from 'react'

export default function Info() {
  const { data, isLoading, error, refetch } = useSettingDataQuery(undefined)
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '',
    delivery_charge: '',
    contact_email: '',
    contact_phone: '',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  // Initialize form data when data is loaded
  useEffect(() => {
    if (data && data.status === 'success' && data.data.length > 0) {
      const settings = data.data[0]
      setFormData({
        name: settings.name || '',
        description: settings.description || '',
        version: settings.version || '',
        delivery_charge: settings.delivery_charge?.toString() || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
      })
      setLogoPreview(settings.logo || '')
    }
  }, [data])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })
    
    try {
      const formDataToSend = new FormData()

      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('version', formData.version)
      formDataToSend.append('delivery_charge', formData.delivery_charge)
      formDataToSend.append('contact_email', formData.contact_email)
      formDataToSend.append('contact_phone', formData.contact_phone)
      // Append all text fields

      
      // Append logo file if selected
      if (logoFile) {
        formDataToSend.append('logo', logoFile)
      }
      
      const result = await updateSetting(formDataToSend).unwrap()
      
      if (result.status === 'success') {
        setMessage({ text: 'Settings updated successfully!', type: 'success' })
        refetch() // Refetch the latest data
      } else {
        setMessage({ text: 'Failed to update settings', type: 'error' })
      }
    } catch (err) {
      setMessage({ text: 'An error occurred while updating settings', type: 'error' })
      console.error('Update error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Error loading settings</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8 text-black">
      <div className="container mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Platform Settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your platform configuration</p>
          </div>
          
 
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Logo Upload */}
              <div>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label className="ml-5 relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Change logo</span>
                    <input 
                      type="file" 
                      className="sr-only" 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter platform name"
                />
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter platform description"
                />
              </div>

              {/* Version Field */}
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  name="version"
                  id="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter version number"
                />
              </div>

              {/* Delivery Charge Field */}
              <div>
                <label htmlFor="delivery_charge" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Charge
                </label>
                <input
                  type="number"
                  name="delivery_charge"
                  id="delivery_charge"
                  value={formData.delivery_charge}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter delivery charge"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Contact Email Field */}
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  id="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter contact email"
                />
              </div>

              {/* Contact Phone Field */}
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter contact phone"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}