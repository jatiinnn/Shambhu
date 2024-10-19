'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { ChevronDown, Moon, Sun, Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '../../firebase/config'
import { collection, addDoc } from 'firebase/firestore'

export default function NewItem() {
    // const router = useRouter()
    const [theme, setTheme] = useState('light')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }, [])

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

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    const menuItems = [
        {
            title: 'Agent',
            subItems: [
                { name: 'New Agent', link: '/new-agent' },
                { name: 'Agent List', link: '/agent-list' }
            ]
        },
        {
            title: 'Party',
            subItems: [
                { name: 'New Party', link: '/new-party' },
                { name: 'Parties List', link: '/parties-list' }
            ]
        },
        {
            title: 'Unit',
            subItems: [
                { name: 'New Unit', link: '/new-unit' },
                { name: 'Units List', link: '/units-list' }
            ]
        },
        {
            title: 'HSN Form',
            subItems: [
                { name: 'New HSN Form', link: '/new-hsn-form' },
                { name: 'HSN Forms List', link: '/hsn-forms-list' }
            ]
        },
        {
            title: 'Item',
            subItems: [
                { name: 'New Item', link: '/new-item' },
                { name: 'Items List', link: '/items-list' }
            ]
        },
        {
            title: 'Transport',
            subItems: [
                { name: 'New Transport', link: '/new-transport' },
                { name: 'Transports List', link: '/transports-list' }
            ]
        }
    ]

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        // Union Territories
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
        "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ]

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
          <Image src="/logo.png" alt="DDSoft Logo" width={40} height={40} />
          <span className="text-2xl font-bold">DDSoft</span>
        </Link>
          <nav className="hidden md:flex flex-grow justify-center">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors duration-200">
                <span>Master</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                  {menuItems.map((item, index) => (
                    <div key={index} className="relative group/item px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between text-gray-800 dark:text-white">
                        <span className="font-semibold">{item.title}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="absolute left-full top-0 mt-0 ml-1 w-48 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 ease-in-out">
                        <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <Link 
                              key={subIndex}
                              href={subItem.link}
                              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <nav className="py-4">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-4 px-4">
                <h2 className="font-semibold mb-2">{item.title}</h2>
                <ul className="ml-4">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="mb-1">
                      <Link
                        href={subItem.link}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}

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
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">About Us</h3>
          <p className="mb-4 max-w-2xl mx-auto">
            We are a company dedicated to providing efficient and user-friendly management solutions for businesses of all sizes.
            Our Dashboard App is designed to streamline your operations and improve productivity.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Dashboard App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}