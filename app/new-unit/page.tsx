'use client'

import { useState } from 'react'
import { db } from '../../firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function NewUnit() {
  const [formData, setFormData] = useState({ unit: '' })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Check form data
    try {
      const docRef = await addDoc(collection(db, 'Unit'), { unit: formData.unit });
      console.log('Document written with ID: ', docRef.id); // Log the document ID
      setFormData({ unit: '' }); // Reset the form after submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCancel = () => {
    setFormData({ unit: '' }); // Reset the form on cancel
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">New Unit</h1>
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
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={formData.unit}
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