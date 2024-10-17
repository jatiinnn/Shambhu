'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { ChevronDown, Moon, Sun, Menu } from 'lucide-react';
import { db } from '../../firebase/config';
import Link from 'next/link';
import Image from 'next/image'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Define the Transport type
interface Transport {
    id: string;
    transportName: string;
    address: string;
    city: string;
    state: string;
    phoneNo: string;
}

export default function TransportList() {
    // const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [transportList, setTransportList] = useState<Transport[]>([]);
    const [expandedTransportId, setExpandedTransportId] = useState<string | null>(null);
    const [transportData, setTransportData] = useState<Transport>({ id: '', transportName: '', address: '', city: '', state: '', phoneNo: '' });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        const fetchTransportRecords = async () => {
            try {
                const data = await getDocs(collection(db, 'Transport'));
                const transportList: Transport[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transport));
                setTransportList(transportList);
            } catch (error) {
                console.error("Error fetching transport records: ", error);
            }
        };

        fetchTransportRecords();
    }, []);

    const handleExpandToggle = (id: string) => {
        setExpandedTransportId(expandedTransportId === id ? null : id);
        if (expandedTransportId === id) {
            setTransportData({ id: '', transportName: '', address: '', city: '', state: '', phoneNo: '' }); // Reset input when collapsing
        } else {
            const transport = transportList.find(t => t.id === id);
            if (transport) {
                setTransportData(transport); // Load existing data for editing
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const transportRef = doc(db, 'Transport', transportData.id);
            await updateDoc(transportRef, { 
                transportName: transportData.transportName, 
                address: transportData.address, 
                city: transportData.city, 
                state: transportData.state, 
                phoneNo: transportData.phoneNo 
            });
            setTransportList(transportList.map(t => (t.id === transportData.id ? transportData : t)));
            setTransportData({ id: '', transportName: '', address: '', city: '', state: '', phoneNo: '' });
            setExpandedTransportId(null);
        } catch (error) {
            console.error("Error updating transport record: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const transportRef = doc(db, 'Transport', id);
            await deleteDoc(transportRef);
            setTransportList(transportList.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting transport record: ", error);
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
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transport List</h1>
                        </div>
                        <div className="px-6 py-4">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">S.No</th>
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Transport Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transportList.map((transport, index) => (
                                        <tr key={transport.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <button 
                                                    onClick={() => handleExpandToggle(transport.id)} 
                                                    className="text-left w-full flex justify-between items-center"
                                                >
                                                    <span>{transport.transportName}</span>
                                                    <ChevronDown className={`transition-transform ${expandedTransportId === transport.id ? 'transform rotate-180' : ''}`} />
                                                </button>
                                                {expandedTransportId === transport.id && (
                                                    <div className="ml-4 mt-2">
                                                        <input
                                                            type="text"
                                                            value={transportData.transportName}
                                                            onChange={(e) => setTransportData({ ...transportData, transportName: e.target.value })}
                                                            className="border border-gray-300 rounded-md px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                            placeholder="Transport Name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={transportData.address}
                                                            onChange={(e) => setTransportData({ ...transportData, address: e.target.value })}
                                                            className="border border-gray-300 rounded-md px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                            placeholder="Address"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={transportData.city}
                                                            onChange={(e) => setTransportData({ ...transportData, city: e.target.value })}
                                                            className="border border-gray-300 rounded-md px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                            placeholder="City"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={transportData.state}
                                                            onChange={(e) => setTransportData({ ...transportData, state: e.target.value })}
                                                            className="border border-gray-300 rounded-md px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                            placeholder="State"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={transportData.phoneNo}
                                                            onChange={(e) => setTransportData({ ...transportData, phoneNo: e.target.value })}
                                                            className="border border-gray-300 rounded-md px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                            placeholder="Phone No"
                                                        />
                                                        <div className="flex justify-center space-x-2 mt-2">
                                                            <button
                                                                onClick={handleUpdate}
                                                                className="px-2 py-1 bg-blue-600 text-white rounded-md"
                                                            >
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(transport.id)}
                                                                className="px-2 py-1 bg-red-600 text-white rounded-md"
                                                            >
                                                                Delete
                                                            </button>
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