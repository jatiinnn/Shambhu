'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { db } from '../../firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function NewParty() {
  const [formData, setFormData] = useState({
    code: '',
    partyName: '',
    group: '',
    address: '',
    city: '',
    state: '',
    phoneNo: '',
    email: '',
    agent: '',
    gst: '',
    transport: '',
    openingType1: '',
    openingDate1: '',
    openingBalance1: '',
    discount1: '',
    closingBalance: '',
    openingType2: '',
    openingDate2: '',
    openingBalance2: '',
    discount2: '',
    privateMarka: ''
  })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate phone number
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(formData.phoneNo)) {
        alert('Please enter a valid 10-digit Indian mobile number')
        return
      }

      // Convert phone number to string
      const partyData = {
        ...formData,
        phoneNo: formData.phoneNo.toString()
      }

      // Save to Firebase
      await addDoc(collection(db, 'Party'), partyData)

      // Reset form
      setFormData({
        code: '',
        partyName: '',
        group: '',
        address: '',
        city: '',
        state: '',
        phoneNo: '',
        email: '',
        agent: '',
        gst: '',
        transport: '',
        openingType1: '',
        openingDate1: '',
        openingBalance1: '',
        discount1: '',
        closingBalance: '',
        openingType2: '',
        openingDate2: '',
        openingBalance2: '',
        discount2: '',
        privateMarka: ''
      })

      alert('Party details saved successfully!')
    } catch (error) {
      console.error('Error saving party details:', error)
      alert('An error occurred while saving party details')
    }
  }

  const handleCancel = () => {
    setFormData({
      code: '',
      partyName: '',
      group: '',
      address: '',
      city: '',
      state: '',
      phoneNo: '',
      email: '',
      agent: '',
      gst: '',
      transport: '',
      openingType1: '',
      openingDate1: '',
      openingBalance1: '',
      discount1: '',
      closingBalance: '',
      openingType2: '',
      openingDate2: '',
      openingBalance2: '',
      discount2: '',
      privateMarka: ''
    })
  }


  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">New Party</h1>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4 text-right">
            <span className="text-red-500">*</span> = Required Information
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="openingType1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opening Type 1 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="openingType1"
                  name="openingType1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={formData.openingType1}
                  onChange={handleInputChange}
                >
                  <option value="">--None--</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="partyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Party Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.partyName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="openingDate1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opening Date 1
              </label>
              <input
                type="date"
                id="openingDate1"
                name="openingDate1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.openingDate1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group
              </label>
              <div className="relative">
                <select
                  id="group"
                  name="group"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={formData.group}
                  onChange={handleInputChange}
                >
                  <option value="">--None--</option>
                  {/* Add group options here */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="openingBalance1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opening Balance 1
              </label>
              <input
                type="number"
                id="openingBalance1"
                name="openingBalance1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.openingBalance1}
                onChange={handleInputChange}
              
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="discount1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount 1 (in %)
              </label>
              <input
                type="number"
                id="discount1"
                name="discount1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.discount1}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="closingBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Closing Balance
              </label>
              <input
                type="number"
                id="closingBalance"
                name="closingBalance"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.closingBalance}
                onChange={handleInputChange}
              />
            </div>
            <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <div className="relative">
                  <select
                    id="state"
                    name="state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    <option value="">--None--</option>
                    {indianStates.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            <div>
              <label htmlFor="openingType2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opening Type 2
              </label>
              <div className="relative">
                <select
                  id="openingType2"
                  name="openingType2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={formData.openingType2}
                  onChange={handleInputChange}
                >
                  <option value="">--None--</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone no.
              </label>
              <input
                type="tel"
                id="phoneNo"
                name="phoneNo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.phoneNo}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="openingDate2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opening Date 2
              </label>
              <input
                type="date"
                id="openingDate2"
                name="openingDate2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.openingDate2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="openingBalance2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opening Balance 2
              </label>
              <input
                type="number"
                id="openingBalance2"
                name="openingBalance2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.openingBalance2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="agent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agent
              </label>
              <input
                type="text"
                id="agent"
                name="agent"
                placeholder="Search Agents..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.agent}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="discount2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount 2 (in %)
              </label>
              <input
                type="number"
                id="discount2"
                name="discount2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.discount2}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="gst" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GST
              </label>
              <input
                type="text"
                id="gst"
                name="gst"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.gst}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="privateMarka" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Private Marka
              </label>
              <input
                type="text"
                id="privateMarka"
                name="privateMarka"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.privateMarka}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="transport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transport
              </label>
              <input
                type="text"
                id="transport"
                name="transport"
                placeholder="Search Transports..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.transport}
                onChange={handleInputChange}
              />
            </div>
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