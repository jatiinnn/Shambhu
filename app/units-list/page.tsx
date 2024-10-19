'use client';

import { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { db } from '../../firebase/config'
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// Define the Unit type
interface Unit {
    id: string;
    unit: string;
}

export default function UnitsList() {
    const [unitList, setUnitList] = useState<Unit[]>([]);
    const [filteredUnitList, setFilteredUnitList] = useState<Unit[]>([]);
    const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [unitData, setUnitData] = useState<Unit>({
        id: '',
        unit: '',
    });

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const data = await getDocs(collection(db, 'Unit'));
                const units: Unit[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
                setUnitList(units);
                setFilteredUnitList(units);
            } catch (error) {
                console.error("Error fetching units: ", error);
            }
        };

        fetchUnits();
    }, []);

    const handleExpandToggle = (id: string) => {
        setExpandedUnitId(expandedUnitId === id ? null : id);
        if (expandedUnitId === id) {
            setUnitData({
                id: '',
                unit: '',
            });
        } else {
            const unit = unitList.find(u => u.id === id);
            if (unit) {
                setUnitData(unit);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const unitRef = doc(db, 'Unit', unitData.id);
            await updateDoc(unitRef, {
                unit: unitData.unit,
            });
            const updatedList = unitList.map(u => (u.id === unitData.id ? unitData : u));
            setUnitList(updatedList);
            setFilteredUnitList(updatedList);
            setUnitData({
                id: '',
                unit: '',
            });
            setExpandedUnitId(null);
        } catch (error) {
            console.error("Error updating unit record: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const unitRef = doc(db, 'Unit', id);
            await deleteDoc(unitRef);
            const updatedList = unitList.filter(u => u.id !== id);
            setUnitList(updatedList);
            setFilteredUnitList(updatedList);
        } catch (error) {
            console.error("Error deleting unit record: ", error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredUnitList(unitList);
        } else {
            const filtered = unitList.filter(unit =>
                unit.unit.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUnitList(filtered);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
                    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Units List</h1>
                            <div className="flex w-1/2">
                                <input
                                    type="text"
                                    placeholder="Search by Unit Name"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        if (e.target.value === '') {
                                            setFilteredUnitList(unitList)
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
                                        <th className="border-b-2 border-gray-300 px-4 py-2 text-left">Unit Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUnitList.map((unit, index) => (
                                        <tr key={unit.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <button onClick={() => handleExpandToggle(unit.id)} className="text-left w-full flex justify-between items-center">
                                                    <span>{unit.unit}</span>
                                                    <ChevronDown className={`transition-transform ${expandedUnitId === unit.id ? 'transform rotate-180' : ''}`} />
                                                </button>
                                                {expandedUnitId === unit.id && (
                                                    <div className="ml-4 mt-2">
                                                        <label className="block mb-1">Unit:</label>
                                                        <input type="text" value={unitData.unit} onChange={(e) => setUnitData({ ...unitData, unit: e.target.value })} className="border border-gray-300 rounded-md px-2 py-1 mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Unit Name" />
                                                        <div className="flex justify-center space-x-2 mt-2">
                                                            <button onClick={handleUpdate} className="px-2 py-1 bg-blue-600 text-white rounded-md">Update</button>
                                                            <button onClick={() => handleDelete(unit.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Delete</button>
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