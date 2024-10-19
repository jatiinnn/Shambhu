'use client';

import { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { db } from '../../firebase/config'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

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
    const [transportList, setTransportList] = useState<Transport[]>([]);
    const [filteredTransportList, setFilteredTransportList] = useState<Transport[]>([]);
    const [expandedTransportId, setExpandedTransportId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [transportData, setTransportData] = useState<Transport>({
        id: '',
        transportName: '',
        address: '',
        city: '',
        state: '',
        phoneNo: '',
    });

    useEffect(() => {
        const fetchTransports = async () => {
            try {
                const data = await getDocs(collection(db, 'Transport'));
                const transports: Transport[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transport));
                setTransportList(transports);
                setFilteredTransportList(transports);
            } catch (error) {
                console.error("Error fetching transports: ", error);
            }
        };

        fetchTransports();
    }, []);

    const handleExpandToggle = (id: string) => {
        setExpandedTransportId(expandedTransportId === id ? null : id);
        if (expandedTransportId === id) {
            setTransportData({
                id: '',
                transportName: '',
                address: '',
                city: '',
                state: '',
                phoneNo: '',
            });
        } else {
            const transport = transportList.find(t => t.id === id);
            if (transport) {
                setTransportData(transport);
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
                phoneNo: transportData.phoneNo,
            });
            const updatedList = transportList.map(t => (t.id === transportData.id ? transportData : t));
            setTransportList(updatedList);
            setFilteredTransportList(updatedList);
            setTransportData({
                id: '',
                transportName: '',
                address: '',
                city: '',
                state: '',
                phoneNo: '',
            });
            setExpandedTransportId(null);
        } catch (error) {
            console.error("Error updating transport record: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const transportRef = doc(db, 'Transport', id);
            await deleteDoc(transportRef);
            const updatedList = transportList.filter(t => t.id !== id);
            setTransportList(updatedList);
            setFilteredTransportList(updatedList);
        } catch (error) {
            console.error("Error deleting transport record: ", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredTransportList(transportList);
        } else {
            const filtered = transportList.filter(transport =>
                transport.transportName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTransportList(filtered);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
                    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transport List</h1>
                            <div className="flex w-1/2">
                                <input
                                    type="text"
                                    placeholder="Search by Transport Name"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        if (e.target.value === '') {
                                            setFilteredTransportList(transportList)
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
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Transport Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransportList.map((transport, index) => (
                                        <tr key={transport.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <button onClick={() => handleExpandToggle(transport.id)} className="text-left w-full flex justify-between items-center">
                                                    <span>{transport.transportName}</span>
                                                    <ChevronDown className={`transition-transform ${expandedTransportId === transport.id ? 'transform rotate-180' : ''}`} />
                                                </button>
                                                {expandedTransportId === transport.id && (
                                                    <div className="ml-4 mt-2">
                                                        <label className="block mb-1">Transport Name:</label>
                                                        <input type="text" value={transportData.transportName} onChange={(e) => setTransportData({ ...transportData, transportName: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Transport Name" />
                                                        <label className="block mb-1">Address:</label>
                                                        <input type="text" value={transportData.address} onChange={(e) => setTransportData({ ...transportData, address: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Address" />
                                                        <label className="block mb-1">City:</label>
                                                        <input type="text" value={transportData.city} onChange={(e) => setTransportData({ ...transportData, city: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="City" />
                                                        <label className="block mb-1">State:</label>
                                                        <input type="text" value={transportData.state} onChange={(e) => setTransportData({ ...transportData, state: e.target.value })} className="border border-gray-300 rounded-md px-2  py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="State" />
                                                        <label className="block mb-1">Phone No:</label>
                                                        <input type="text" value={transportData.phoneNo} onChange={(e) => setTransportData({ ...transportData, phoneNo: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Phone No" />
                                                        <div className="flex justify-center space-x-2 mt-2">
                                                            <button onClick={handleUpdate} className="px-2 py-1 bg-blue-600 text-white rounded-md">Update</button>
                                                            <button onClick={() => handleDelete(transport.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Delete</button>
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