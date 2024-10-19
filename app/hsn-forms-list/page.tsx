'use client';

import { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { db } from '../../firebase/config'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// Define the HSN type
interface HSN {
    id: string;
    hsnCode: string;
    gst: string;
}

export default function HSNList() {
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


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
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

            <Footer />
        </div>
    )
}