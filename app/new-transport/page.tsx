'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { db } from '../../firebase/config'
import { ChevronDown } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface FormData {
  transportName: string;
  address: string;
  city: string;
  state: string;
  phoneNo: string;
}

interface Errors {
  phoneNo?: string;
}

export default function NewTransport() {
  const [formData, setFormData] = useState<FormData>({
    transportName: '',
    address: '',
    city: '',
    state: '',
    phoneNo: ''
  })
  const [errors, setErrors] = useState<Errors>({})


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' })) // Clear errors on input change
  }

  const validatePhoneNumber = (phone: string): boolean => {
    const regex = /^[0-9]{10}$/; // Simple regex for 10-digit phone numbers
    return regex.test(phone);
  }
  const handleCancel = () => {
    // Reset the form data to initial state
    setFormData({
      transportName: '',
      address: '',
      city: '',
      state: '',
      phoneNo: ''
    });
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNo)) {
      setErrors({ phoneNo: 'Invalid phone number. Must be 10 digits.' });
      return;
    }

    // Prepare the data to be saved in Firebase
    const transportData = {
      ...formData,
      phoneNo: String(formData.phoneNo) // Ensure phoneNo is a string
    };

    console.log('Form submitted:', transportData);

    // Save data to Firebase
    try {
      await addDoc(collection(db, 'Transport'), transportData);
      // Reset form after successful submission
      setFormData({
        transportName: '',
        address: '',
        city: '',
        state: '',
        phoneNo: ''
      });
      // Navigate or show success message
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving document:', error);
    }
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">New Transport</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-right">
                <span className="text-red-500">*</span> = Required Information
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="transportName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transport Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="transportName"
                    name="transportName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={formData.transportName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone no.
                  </label>
                  <input
                    type="tel"
                    id="phoneNo"
                    name="phoneNo"
                    className={`w-full px-3 py-2 border ${errors.phoneNo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNo && <p className="text-red-500 text-sm">{errors.phoneNo}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    value={formData.address}
                    onChange={handleInputChange}
                  ></textarea>
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
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Puducherry">Puducherry</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
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