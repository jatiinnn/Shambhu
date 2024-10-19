'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { db } from '../../firebase/config'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface Agent {
  id: string
  name: string
  address: string
  city: string
  state: string
  phoneNo: string
  commission: string
  openingType: string
  openingBalance: string
  openingDate: string
  closingBalance: string
}

export default function AgentList() {
  const [agentList, setAgentList] = useState<Agent[]>([])
  const [filteredAgentList, setFilteredAgentList] = useState<Agent[]>([])
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [agentData, setAgentData] = useState<Agent>({
    id: '',
    name: '',
    address: '',
    city: '',
    state: '',
    phoneNo: '',
    commission: '',
    openingType: '',
    openingBalance: '',
    openingDate: '',
    closingBalance: ''
  })

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getDocs(collection(db, 'Agent'))
        const agents: Agent[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent))
        setAgentList(agents)
        setFilteredAgentList(agents)
      } catch (error) {
        console.error("Error fetching agents: ", error)
      }
    }

    fetchAgents()
  }, [])

  const handleExpandToggle = (id: string) => {
    setExpandedAgentId(expandedAgentId === id ? null : id)
    if (expandedAgentId === id) {
      setAgentData({
        id: '',
        name: '',
        address: '',
        city: '',
        state: '',
        phoneNo: '',
        commission: '',
        openingType: '',
        openingBalance: '',
        openingDate: '',
        closingBalance: ''
      })
    } else {
      const agent = agentList.find(a => a.id === id)
      if (agent) {
        setAgentData(agent)
      }
    }
  }

  const handleUpdate = async () => {
    try {
      const agentRef = doc(db, 'Agent', agentData.id)
      await updateDoc(agentRef, {
        name: agentData.name,
        address: agentData.address,
        city: agentData.city,
        state: agentData.state,
        phoneNo: agentData.phoneNo,
        commission: agentData.commission,
        openingType: agentData.openingType,
        openingBalance: agentData.openingBalance,
        openingDate: agentData.openingDate,
        closingBalance: agentData.closingBalance,
      })
      const updatedList = agentList.map(a => (a.id === agentData.id ? agentData : a))
      setAgentList(updatedList)
      setFilteredAgentList(updatedList)
      setAgentData({
        id: '',
        name: '',
        address: '',
        city: '',
        state: '',
        phoneNo: '',
        commission: '',
        openingType: '',
        openingBalance: '',
        openingDate: '',
        closingBalance: ''
      })
      setExpandedAgentId(null)
    } catch (error) {
      console.error("Error updating agent record: ", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const agentRef = doc(db, 'Agent', id)
      await deleteDoc(agentRef)
      const updatedList = agentList.filter(a => a.id !== id)
      setAgentList(updatedList)
      setFilteredAgentList(updatedList)
    } catch (error) {
      console.error("Error deleting agent record: ", error)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredAgentList(agentList)
    } else {
      const filtered = agentList.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredAgentList(filtered)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agent List</h1>
              <div className="flex w-1/2">
                <input
                  type="text"
                  placeholder="Search by Agent Name"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (e.target.value === '') {
                      setFilteredAgentList(agentList)
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
                    <th className="border-b-2 border-gray-300  px-4 py-2 text-left">S.No</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Agent Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgentList.map((agent, index) => (
                    <tr key={agent.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <button onClick={() => handleExpandToggle(agent.id)} className="text-left w-full flex justify-between items-center">
                          <span>{agent.name}</span>
                          <ChevronDown className={`transition-transform ${expandedAgentId === agent.id ? 'transform rotate-180' : ''}`} />
                        </button>
                        {expandedAgentId === agent.id && (
                          <div className="ml-4 mt-2">
                            <label className="block mb-1">Name:</label>
                            <input type="text" value={agentData.name} onChange={(e) => setAgentData({ ...agentData, name: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Name" />
                            <label className="block mb-1">Address:</label>
                            <input type="text" value={agentData.address} onChange={(e) => setAgentData({ ...agentData, address: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Address" />
                            <label className="block mb-1">City:</label>
                            <input type="text" value={agentData.city} onChange={(e) => setAgentData({ ...agentData, city: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="City" />
                            <label className="block mb-1">State:</label>
                            <input type="text" value={agentData.state} onChange={(e) => setAgentData({ ...agentData, state: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="State" />
                            <label className="block mb-1">Phone No:</label>
                            <input type="text" value={agentData.phoneNo} onChange={(e) => setAgentData({ ...agentData, phoneNo: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Phone No" />
                            <label className="block mb-1">Commission:</label>
                            <input type="text" value={agentData.commission} onChange={(e) => setAgentData({ ...agentData, commission: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Commission" />
                            <label className="block mb-1">Opening Type:</label>
                            <input type="text" value={agentData.openingType} onChange={(e) => setAgentData({ ...agentData, openingType: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Opening Type" />
                            <label className="block mb-1">Opening Balance:</label>
                            <input type="text" value={agentData.openingBalance} onChange={(e) => setAgentData({ ...agentData, openingBalance: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Opening Balance" />
                            <label className="block mb-1">Opening Date:</label>
                            <input type="date" value={agentData.openingDate} onChange={(e) => setAgentData({ ...agentData, openingDate: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" />
                            <label className="block mb-1">Closing Balance:</label>
                            <input type="text" value={agentData.closingBalance} onChange={(e) => setAgentData({ ...agentData, closingBalance: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Closing Balance" />
                            <div className="flex justify-center space-x-2 mt-2">
                              <button onClick={handleUpdate} className="px-2 py-1 bg-blue-600 text-white rounded-md">Update</button>
                              <button onClick={() => handleDelete(agent.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Delete</button>
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
      <Footer />
    </div>
  )
}