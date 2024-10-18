'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { ChevronDown, Moon, Sun, Menu } from 'lucide-react';
import { db } from '../../firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Define the Agent type
interface Agent {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    phoneNo: string;
    commission: string;
    openingType: string;
    openingBalance: string;
    openingDate: string;
    closingBalance: string;
}

export default function AgentList() {
    // const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
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
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        const fetchAgents = async () => {
            try {
                const data = await getDocs(collection(db, 'Agent'));
                const agents: Agent[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
                setAgentList(agents);
            } catch (error) {
                console.error("Error fetching agents: ", error);
            }
        };

        fetchAgents();
    }, []);

    const handleExpandToggle = (id: string) => {
        setExpandedAgentId(expandedAgentId === id ? null : id);
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
            }); // Reset input when collapsing
        } else {
            const agent = agentList.find(a => a.id === id);
            if (agent) {
                setAgentData(agent); // Load existing data for editing
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const agentRef = doc(db, 'Agent', agentData.id);
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
            });
            setAgentList(agentList.map(a => (a.id === agentData.id ? agentData : a)));
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
            });
            setExpandedAgentId(null);
        } catch (error) {
            console.error("Error updating agent record: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const agentRef = doc(db, 'Agent', id);
            await deleteDoc(agentRef);
            setAgentList(agentList.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting agent record: ", error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // Navigation menu items
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
    ];

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

            <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
                    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Agent List</h1>
                        </div>
                        <div className="px-6 py-4">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">S.No</th>
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Agent Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agentList.map((agent, index) => (
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
    );
}