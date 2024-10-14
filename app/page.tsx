'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [theme, setTheme] = useState('light')
  const [masterOpen, setMasterOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const menuItems = [
    {
      title: 'Agent',
      subItems: ['New Agent', 'Agent List']
    },
    {
      title: 'Party',
      subItems: ['New Party', 'Parties List']
    },
    {
      title: 'Unit',
      subItems: ['New Unit', 'Units List']
    },
    {
      title: 'HSN Form',
      subItems: ['New HSN Form', 'HSN Forms List']
    },
    {
      title: 'Item',
      subItems: ['New Item', 'Items List']
    },
    {
      title: 'Transport',
      subItems: ['New Transport', 'Transports List']
    }
  ]

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <nav>
            <ul className="flex space-x-4">
              <li className="relative group">
                <button 
                  className="flex items-center space-x-1 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-yellow-300"
                  onClick={() => setMasterOpen(!masterOpen)}
                >
                  <span>Master</span>
                  <ChevronDown size={16} />
                </button>
                {masterOpen && (
                  <ul className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    {menuItems.map((item, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 group/item relative">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800 dark:text-white">{item.title}</span>
                          <ChevronRight size={16} className="text-gray-500" />
                        </div>
                        <ul className="hidden group-hover/item:block absolute left-full top-0 mt-0 ml-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link 
                                href="#" 
                                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-300"
                              >
                                {subItem}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/20">
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </header>

      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">Welcome to Your Dashboard</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            This is a responsive web application built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-4">About Us</h3>
          <p className="mb-4">
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