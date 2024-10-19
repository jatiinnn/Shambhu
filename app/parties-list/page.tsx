'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { ChevronDown, Moon, Sun, Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

interface Party {
  id: string;
  code: string;
  partyName: string;
  group: string;
  address: string;
  city: string;
  state: string;
  phoneNo: string;
  email: string;
  agent: string;
  gst: string;
  transport: string;
  openingType1: string;
  openingDate1: string;
  openingBalance1: string;
  discount1: string;
  closingBalance: string;
  openingType2: string;
  openingDate2: string;
  openingBalance2: string;
  discount2: string;
  privateMarka: string;
}

export default function PartiesList() {
  // const router = useRouter()
  const [theme, setTheme] = useState('light')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [partyList, setPartyList] = useState<Party[]>([])
  const [filteredPartyList, setFilteredPartyList] = useState<Party[]>([])
  const [expandedPartyId, setExpandedPartyId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [partyData, setPartyData] = useState<Party>({
    id: '',
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

    const fetchParties = async () => {
      try {
        const data = await getDocs(collection(db, 'Party'))
        const parties: Party[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Party))
        setPartyList(parties)
        setFilteredPartyList(parties)
      } catch (error) {
        console.error("Error fetching parties: ", error)
      }
    }

    fetchParties()
  }, [])

  const handleExpandToggle = (id: string) => {
    setExpandedPartyId(expandedPartyId === id ? null : id)
    if (expandedPartyId === id) {
      setPartyData({
        id: '',
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
    } else {
      const party = partyList.find(p => p.id === id)
      if (party) {
        setPartyData(party)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPartyData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleUpdate = async () => {
    try {
      const partyRef = doc(db, 'Party', partyData.id)
      const updateData = Object.entries(partyData).reduce((acc, [key, value]) => {
        if (key !== 'id') {
          acc[key] = value
        }
        return acc
      }, {} as { [key: string]: any })
      await updateDoc(partyRef, updateData)
      setPartyList(partyList.map(p => (p.id === partyData.id ? partyData : p)))
      setFilteredPartyList(filteredPartyList.map(p => (p.id === partyData.id ? partyData : p)))
      setExpandedPartyId(null)
    } catch (error) {
      console.error("Error updating party record: ", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const partyRef = doc(db, 'Party', id)
      await deleteDoc(partyRef)
      setPartyList(partyList.filter(p => p.id !== id))
      setFilteredPartyList(filteredPartyList.filter(p => p.id !== id))
      setExpandedPartyId(null)
    } catch (error) {
      console.error("Error deleting party record: ", error)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredPartyList(partyList)
    } else {
      const filtered = partyList.filter(party => 
        party.partyName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPartyList(filtered)
    }
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
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors duration-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
          {menuItems.map((item, index) => (
            <div key={index} className="px-4 py-2">
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
            </div>
          ))}
        </div>
      )}

      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Parties List</h1>
              <div className="flex w-1/2">
                <input
                  type="text"
                  placeholder="Search by Party Name"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (e.target.value === '') {
                      setFilteredPartyList(partyList)
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">S.No</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Party Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartyList.map((party, index) => (
                    <tr key={party.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <button onClick={() => handleExpandToggle(party.id)} className="text-left w-full flex justify-between items-center">
                          <span>{party.partyName}</span>
                          <ChevronDown className={`transition-transform ${expandedPartyId === party.id ? 'transform rotate-180' : ''}`} />
                        </button>
                        {expandedPartyId === party.id && (
                          <div className="ml-4 mt-2">
                            <label className="block mb-1">Code:</label>
                            <input type="text" name="code" value={partyData.code} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500  dark:placeholder-gray-400" placeholder="Code" />
                            <label className="block mb-1">Party Name:</label>
                            <input type="text" name="partyName" value={partyData.partyName} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Party Name" />
                            <label className="block mb-1">Group:</label>
                            <input type="text" name="group" value={partyData.group} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Group" />
                            <label className="block mb-1">Address:</label>
                            <input type="text" name="address" value={partyData.address} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Address" />
                            <label className="block mb-1">City:</label>
                            <input type="text" name="city" value={partyData.city} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="City" />
                            <label className="block mb-1">State:</label>
                            <input type="text" name="state" value={partyData.state} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="State" />
                            <label className="block mb-1">Phone No:</label>
                            <input type="text" name="phoneNo" value={partyData.phoneNo} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Phone No" />
                            <label className="block mb-1">Email:</label>
                            <input type="email" name="email" value={partyData.email} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Email" />
                            <label className="block mb-1">Agent:</label>
                            <input type="text" name="agent" value={partyData.agent} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Agent" />
                            <label className="block mb-1">GST:</label>
                            <input type="text" name="gst" value={partyData.gst} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="GST" />
                            <label className="block mb-1">Transport:</label>
                            <input type="text" name="transport" value={partyData.transport} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Transport" />
                            <label className="block mb-1">Opening Type 1:</label>
                            <input type="text" name="openingType1" value={partyData.openingType1} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Opening Type 1" />
                            <label className="block mb-1">Opening Date 1:</label>
                            <input type="date" name="openingDate1" value={partyData.openingDate1} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                            <label className="block mb-1">Opening Balance 1:</label>
                            <input type="text" name="openingBalance1" value={partyData.openingBalance1} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Opening Balance 1" />
                            <label className="block mb-1">Discount 1:</label>
                            <input type="text" name="discount1" value={partyData.discount1} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Discount 1" />
                            <label className="block mb-1">Closing Balance:</label>
                            <input type="text" name="closingBalance" value={partyData.closingBalance} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Closing Balance" />
                            <label className="block mb-1">Opening Type 2:</label>
                            <input type="text" name="openingType2" value={partyData.openingType2} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Opening Type 2" />
                            <label className="block mb-1">Opening Date 2:</label>
                            <input type="date" name="openingDate2" value={partyData.openingDate2} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                            <label className="block mb-1">Opening Balance 2:</label>
                            <input type="text" name="openingBalance2" value={partyData.openingBalance2} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Opening Balance 2" />
                            <label className="block mb-1">Discount 2:</label>
                            <input type="text" name="discount2" value={partyData.discount2} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Discount 2" />
                            <label className="block mb-1">Private Marka:</label>
                            <input type="text" name="privateMarka" value={partyData.privateMarka} onChange={handleInputChange} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Private Marka" />
                            <div className="flex justify-center space-x-2 mt-2">
                              <button onClick={handleUpdate} className="px-2 py-1 bg-blue-600 text-white rounded-md">Update</button>
                              <button onClick={() => handleDelete(party.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Delete</button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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