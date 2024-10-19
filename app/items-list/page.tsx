'use client';

import { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { db } from '../../firebase/config'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

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


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
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

            <Footer />
        </div>
    )
}