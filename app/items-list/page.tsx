'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Moon, Sun, Menu, Search } from 'lucide-react';
import { db } from '../../firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Define the Item type
interface Item {
    id: string;
    itemName: string;
    hsnCode: string;
    itemTypes: string[];
    designCode: string;
    unit: string;
    size1: string;
    size2: string;
}

export default function ItemsList() {
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [itemList, setItemList] = useState<Item[]>([]);
    const [filteredItemList, setFilteredItemList] = useState<Item[]>([]);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemData, setItemData] = useState<Item>({
        id: '',
        itemName: '',
        hsnCode: '',
        itemTypes: [],
        designCode: '',
        unit: '',
        size1: '',
        size2: '',
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');

        const fetchItems = async () => {
            try {
                const data = await getDocs(collection(db, 'Item'));
                const items: Item[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
                setItemList(items);
                setFilteredItemList(items);
            } catch (error) {
                console.error("Error fetching items: ", error);
            }
        };

        fetchItems();
    }, []);

    const handleExpandToggle = (id: string) => {
        setExpandedItemId(expandedItemId === id ? null : id);
        if (expandedItemId === id) {
            setItemData({
                id: '',
                itemName: '',
                hsnCode: '',
                itemTypes: [],
                designCode: '',
                unit: '',
                size1: '',
                size2: '',
            });
        } else {
            const item = itemList.find(i => i.id === id);
            if (item) {
                setItemData(item);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const itemRef = doc(db, 'Item', itemData.id);
            await updateDoc(itemRef, {
                itemName: itemData.itemName,
                hsnCode: itemData.hsnCode,
                itemTypes: itemData.itemTypes,
                designCode: itemData.designCode,
                unit: itemData.unit,
                size1: itemData.size1,
                size2: itemData.size2,
            });
            const updatedList = itemList.map(i => (i.id === itemData.id ? itemData : i));
            setItemList(updatedList);
            setFilteredItemList(updatedList);
            setItemData({
                id: '',
                itemName: '',
                hsnCode: '',
                itemTypes: [],
                designCode: '',
                unit: '',
                size1: '',
                size2: '',
            });
            setExpandedItemId(null);
        } catch (error) {
            console.error("Error updating item record: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const itemRef = doc(db, 'Item', id);
            await deleteDoc(itemRef);
            const updatedList = itemList.filter(i => i.id !== id);
            setItemList(updatedList);
            setFilteredItemList(updatedList);
        } catch (error) {
            console.error("Error deleting item record: ", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredItemList(itemList);
        } else {
            const filtered = itemList.filter(item =>
                item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredItemList(filtered);
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
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Items List</h1>
                            <div className="flex w-1/2">
                                <input
                                    type="text"
                                    placeholder="Search by Item Name"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        if (e.target.value === '') {
                                            setFilteredItemList(itemList)
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
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Item Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItemList.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <button onClick={() => handleExpandToggle(item.id)} className="text-left w-full flex justify-between items-center">
                                                    <span>{item.itemName}</span>
                                                    <ChevronDown className={`transition-transform ${expandedItemId === item.id ? 'transform rotate-180' : ''}`} />
                                                </button>
                                                {expandedItemId === item.id && (
                                                    <div className="ml-4 mt-2">
                                                        <label className="block mb-1">Item Name:</label>
                                                        <input type="text" value={itemData.itemName} onChange={(e) => setItemData({ ...itemData, itemName: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Item Name" />
                                                        <label className="block mb-1">HSN Code:</label>
                                                        <input type="text" value={itemData.hsnCode} onChange={(e) => setItemData({ ...itemData, hsnCode: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="HSN Code" />
                                                        <label className="block mb-1">Item Types:</label>
                                                        <input type="text" value={itemData.itemTypes.join(', ')} onChange={(e) => setItemData({ ...itemData, itemTypes: e.target.value.split(', ') })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Item Types (comma-separated)" />
                                                        
                                                        <label className="block mb-1">Design Code:</label>
                                                        <input type="text" value={itemData.designCode} onChange={(e) => setItemData({ ...itemData, designCode: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Design Code" />
                                                        <label className="block mb-1">Unit:</label>
                                                        <input type="text" value={itemData.unit} onChange={(e) => setItemData({ ...itemData, unit: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Unit" />
                                                        <label className="block mb-1">Size 1:</label>
                                                        <input type="text" value={itemData.size1} onChange={(e) => setItemData({ ...itemData, size1: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Size 1" />
                                                        <label className="block mb-1">Size 2:</label>
                                                        <input type="text" value={itemData.size2} onChange={(e) => setItemData({ ...itemData, size2: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Size 2" />
                                                        <div className="flex justify-center space-x-2 mt-2">
                                                            <button onClick={handleUpdate} className="px-2 py-1 bg-blue-600 text-white rounded-md">Update</button>
                                                            <button onClick={() => handleDelete(item.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Delete</button>
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