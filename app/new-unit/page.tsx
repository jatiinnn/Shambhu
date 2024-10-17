'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { ChevronDown, Moon, Sun, Menu } from 'lucide-react'
import { db } from '../../firebase/config'
import Image from 'next/image'
import Link from 'next/link'
import { collection, addDoc } from 'firebase/firestore';

export default function NewUnit() {
    // const router = useRouter()
    const [theme, setTheme] = useState('light')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [formData, setFormData] = useState({unit: ''})

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')
      }, [])
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prevData => ({...prevData,[name]: value}))
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