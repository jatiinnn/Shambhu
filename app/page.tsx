'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Moon, Sun, ChevronDown, ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { auth } from '../firebase/config'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'

export default function Dashboard() {
  const [theme, setTheme] = useState('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        router.push('/auth')
      }
    })

    return () => unsubscribe()
  }, [router])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('user')
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
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

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <nav className="flex-grow flex justify-center">
            <ul className="flex space-x-4">
              <li className="relative group">
                <div 
                  className="flex items-center space-x-1 cursor-pointer transition-all duration-300 ease-in-out transform group-hover:scale-105"
                >
                  <span>Master</span>
                  <ChevronDown size={16} />
                </div>
                <ul className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  {menuItems.map((item, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 group/item relative">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 dark:text-white">{item.title}</span>
                        <ChevronRight size={16} className="text-gray-500" />
                      </div>
                      <ul className="absolute left-full top-0 mt-0 ml-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 ease-in-out">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link 
                              href={subItem.link}
                              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-300"
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/20">
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-white/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          <ul className="py-2">
            {menuItems.map((item, index) => (
              <li key={index} className="px-4 py-2">
                <span className="font-semibold">{item.title}</span>
                <ul className="ml-4 mt-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link 
                        href={subItem.link}
                        className="block py-1 hover:text-blue-500 dark:hover:text-blue-300"
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto py-8 px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">Welcome to Your Dashboard</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            This is a responsive web application built with Next.js, TypeScript, and Tailwind CSS.
          </p>
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