'use client'

import { useState } from 'react'
import { db } from '../../firebase/config'
import { Search } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function NewItem() {
  const [formData, setFormData] = useState({
    itemName: '',
    hsnCode: '',
    showItemTypes: false,
    showItemDesigns: false,
    showItemSizes: false,
    itemTypes: [''],
    designCode: '',
    unit: '',
    size1: '',
    size2: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const resetForm = () => {
    setFormData({
      itemName: '',
      hsnCode: '',
      showItemTypes: false,
      showItemDesigns: false,
      showItemSizes: false,
      itemTypes: [''],
      designCode: '',
      unit: '',
      size1: '',
      size2: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'Item'), formData)
      console.log('Form submitted:', formData)
      resetForm()
      // Optionally, you can show a success message here
    } catch (error) {
      console.error('Error adding document: ', error)
      // Optionally, you can show an error message here
    }
  }

  const handleCancel = () => {
    resetForm()
  }

  const addItemType = () => {
    setFormData(prevData => ({
      ...prevData,
      itemTypes: [...prevData.itemTypes, '']
    }))
  }

  const updateItemType = (index: number, value: string) => {
    const newItemTypes = [...formData.itemTypes]
    newItemTypes[index] = value
    setFormData(prevData => ({
      ...prevData,
      itemTypes: newItemTypes
    }))
  }


  // const indianStates = [
  //     "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  //     "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  //     "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  //     "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  //     // Union Territories
  //     "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  //     "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  // ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">New Item Name</h1>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="mb-4 text-right">
                <span className="text-red-500">*</span> = Required Information
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemName"
                    name="itemName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={formData.itemName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="hsnCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    HSN Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hsnCode"
                      name="hsnCode"
                      placeholder="Search HSN Form..."
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      value={formData.hsnCode}
                      onChange={handleInputChange}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="showItemTypes"
                      checked={formData.showItemTypes}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 "
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add Item Types</span>
                  </label>
                </div>
                {formData.showItemTypes && (
                  <div className="pl-4 space-y-2">
                    <h3 className="font-semibold">Item Types</h3>
                    {formData.itemTypes.map((itemType, index) => (
                      <input
                        key={index}
                        type="text"
                        value={itemType}
                        onChange={(e) => updateItemType(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Item Type"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={addItemType}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Add Item Type
                    </button>
                  </div>
                )}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="showItemDesigns"
                      checked={formData.showItemDesigns}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add Item Designs</span>
                  </label>
                </div>
                {formData.showItemDesigns && (
                  <div className="pl-4 space-y-2">
                    <h3 className="font-semibold">Item Design Code</h3>
                    <input
                      type="text"
                      name="designCode"
                      value={formData.designCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Design Code"
                    />
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Unit"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Add Item Design Code
                    </button>
                  </div>
                )}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="showItemSizes"
                      checked={formData.showItemSizes}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Add Item Sizes</span>
                  </label>
                </div>
                {formData.showItemSizes && (
                  <div className="pl-4 space-y-2">
                    <h3 className="font-semibold">Item Sizes</h3>
                    <input
                      type="text"
                      name="size1"
                      value={formData.size1}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Size 1"
                    />
                    <input
                      type="text"
                      name="size2"
                      value={formData.size2}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Size 2"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Add Item Sizes
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}