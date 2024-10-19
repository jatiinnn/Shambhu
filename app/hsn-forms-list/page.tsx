'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Moon, Sun, Menu, Search } from 'lucide-react';
import { db } from '../../firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Define the HSN type
interface HSN {
    id: string;
    hsnCode: string;
    gst: string;
}

export default function HSNList() {
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hsnList, setHsnList] = useState<HSN[]>([]);
    const [filteredHsnList, setFilteredHsnList] = useState<HSN[]>([]);
    const [expandedHsnId, setExpandedHsnId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hsnData, setHsnData] = useState<HSN>({
        id: '',
        hsnCode: '',
        gst: '',
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        const fetchHsnRecords = async () => {
            try {
                const data = await getDocs(collection(db, 'HSN'));
                const hsnRecords: HSN[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as HSN));
                setHsnList(hsnRecords);
                setFilteredHsnList(hsnRecords);
            } catch (error) {
                console.error("Error fetching HSN records: ", error);
            }
        };

        fetchHsnRecords();
    }, []);

    const handleExpandToggle = (id: string) => {
        setExpandedHsnId(expandedHsnId === id ? null : id);
        if (expandedHsnId === id) {
            setHsnData({
                id: '',
                hsnCode: '',
                gst: '',
            });
        } else {
            const hsn = hsnList.find(h => h.id === id);
            if (hsn) {
                setHsnData(hsn);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const hsnRef = doc(db, 'HSN', hsnData.id);
            await updateDoc(hsnRef, {
                hsnCode: hsnData.hsnCode,
                gst: hsnData.gst,
            });
            const updatedList = hsnList.map(h => (h.id === hsnData.id ? hsnData : h));
            setHsnList(updatedList);
            setFilteredHsnList(updatedList);
            setHsnData({
                id: '',
                hsnCode: '',
                gst: '',
            });
            setExpandedHsnId(null);
        } catch (error) {
            console.error("Error updating HSN record: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const hsnRef = doc(db, 'HSN', id);
            await deleteDoc(hsnRef);
            const updatedList = hsnList.filter(h => h.id !== id);
            setHsnList(updatedList);
            setFilteredHsnList(updatedList);
        } catch (error) {
            console.error("Error deleting HSN record: ", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredHsnList(hsnList);
        } else {
            const filtered = hsnList.filter(hsn =>
                hsn.hsnCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredHsnList(filtered);
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
                        <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">HSN List</h1>
                            <div className="flex w-1/2">
                                <input
                                    type="text"
                                    placeholder="Search by HSN Code"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        if (e.target.value === '') {
                                            setFilteredHsnList(hsnList)
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
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">HSN Code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHsnList.map((hsn, index) => (
                                        <tr key={hsn.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <button onClick={() => handleExpandToggle(hsn.id)} className="text-left w-full flex justify-between items-center">
                                                    <span>{hsn.hsnCode}</span>
                                                    <ChevronDown className={`transition-transform ${expandedHsnId === hsn.id ? 'transform rotate-180' : ''}`} />
                                                </button>
                                                {expandedHsnId === hsn.id && (
                                                    <div className="ml-4 mt-2">
                                                        <label className="block mb-1">HSN Code:</label>
                                                        <input type="text" value={hsnData.hsnCode} onChange={(e) => setHsnData({ ...hsnData, hsnCode: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="HSN Code" />
                                                        <label className="block mb-1">GST Rate:</label>
                                                        <input type="text" value={hsnData.gst} onChange={(e) => setHsnData({ ...hsnData, gst: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="GST Rate" />
                                                        <div className="flex justify-center space-x-2 mt-2">
                                                            <button onClick={handleUpdate} className="px-2 py-1 bg-blue-600 text-white rounded-md">Update</button>
                                                            <button onClick={() => handleDelete(hsn.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Delete</button>
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