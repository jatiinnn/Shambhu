'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Moon, Sun, Menu } from 'lucide-react'
import Link from 'next/link'

export default function NewParty() {
  const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your backend
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

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-white transition-colors duration-200">
            Dashboard
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.code}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="openingType1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                *Opening Type 1
              </label>
              <div className="relative">
                <select
                  id="openingType1"
                  name="openingType1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
                *Party Name
              </label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="">--None--</option>
                  {/* Add state options here */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.transport}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save & New
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