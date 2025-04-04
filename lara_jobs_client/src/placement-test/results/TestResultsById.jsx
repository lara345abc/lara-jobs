import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { baseURL } from '../../config/baseURL';
import toast from 'react-hot-toast';

const TestResultsById = () => {
    const { test_id } = useParams();
    const [results, setResults] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.post(`${baseURL}/api/placement-test/test/test-results/getAllResultsByTestId`, { placement_test_id: test_id });
                console.log("response candidates ", response)
                setResults(response.data.candidates); 
                setTopics(response.data.topics); 
                console.log('Students:', response.data.candidates);
                // console.log('Topics:', response.data.topics);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching results:', error);
                toast.error('Failed to fetch results.');
                setLoading(false);
            }
        };

        fetchResults();
    }, [test_id]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    useEffect(() => {
        if (sortBy) {
            const sortedResults = [...results].sort((a, b) => {
                if (sortBy === 'student_name') {
                    return sortOrder === 'asc'
                        ? a.student_details.student_name.localeCompare(b.student_details.student_name)
                        : b.student_details.student_name.localeCompare(a.student_details.student_name);
                } else if (sortBy === 'marks_obtained') {
                    return sortOrder === 'asc' ? a.marks_obtained - b.marks_obtained : b.marks_obtained - a.marks_obtained;
                }
                return 0;
            });
            setResults(sortedResults);
        }
    }, [sortBy, sortOrder, results]);

    const applyFilters = () => {
        let filteredResults = results;

        if (filterName) {
            filteredResults = filteredResults.filter(result =>
                result.student_details.student_name.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        return filteredResults;
    };
    const downloadExcelWithDetails = () => {
        const sortedResults = [...results].sort((a, b) => b.marks_obtained - a.marks_obtained);

        // Create a comma-separated string of topics
        const topicsString = topics.join(', ');

        // Create an array for Excel data
        const dataToExport = sortedResults.map(result => ({
            'Student Name': result.student_details.student_name,
            'District': result.student_details.district, 
            'State': result.student_details.state,
            'Email': result.student_details.email,
            'Phone': result.student_details.phone_number,
            'Marks Obtained': result.marks_obtained,
            'Total Marks': result.total_marks,
        }));

        const worksheet = XLSX.utils.json_to_sheet([]);

        // Add topics in the first row
        XLSX.utils.sheet_add_aoa(worksheet, [['Topics: ' + topicsString]], { origin: 'A1' });

        // Add the rest of the data after the topics row
        XLSX.utils.sheet_add_json(worksheet, dataToExport, { origin: 'A2' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results with Details');

        XLSX.writeFile(workbook, `Test_${test_id}_Results_With_Details.xlsx`);
    };

    const downloadExcelWithoutDetails = () => {
        const sortedResults = [...results].sort((a, b) => b.marks_obtained - a.marks_obtained);

        const topicsString = topics.join(', ');

        const dataToExport = sortedResults.map(result => ({
            'Student Name': result.student_details.student_name,
            'District': result.student_details.district, 
            'State': result.student_details.state,
            'Marks Obtained': result.marks_obtained,
            'Total Marks': result.total_marks,
        }));

        const worksheet = XLSX.utils.json_to_sheet([]);

        XLSX.utils.sheet_add_aoa(worksheet, [['Topics: ' + topicsString]], { origin: 'A1' });
        XLSX.utils.sheet_add_json(worksheet, dataToExport, { origin: 'A2' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results Without Details');

        XLSX.writeFile(workbook, `Test_${test_id}_Results_Without_Details.xlsx`);
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-5 px-4">
            <h2 className="text-2xl font-semibold mb-5">Placement Test Results</h2>

            {/* Topics Table */}
            <div className="overflow-x-auto mb-5">
                <table className="min-w-full table-auto border-separate border-spacing-0 border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left bg-gray-200">Test Conducted on these topics</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2">{topics.join(', ')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Filter by Student Name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={downloadExcelWithDetails}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Download Results (with Email & Phone)
                    </button>
                    <button
                        onClick={downloadExcelWithoutDetails}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Download Results (Name, Marks only)
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-separate border-spacing-0 border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left bg-gray-200">SI No</th>
                            <th
                                onClick={() => handleSort('student_name')}
                                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                            >
                                Student Name
                            </th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Phone Number</th>
                            <th
                                onClick={() => handleSort('marks_obtained')}
                                className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                            >
                                Marks Obtained
                            </th>
                            <th className="px-4 py-2 text-left">Total Marks</th>
                            <th className="px-4 py-2 text-left">District</th>
                            <th className="px-4 py-2 text-left">State</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applyFilters().map((result, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{result.student_details.student_name}</td>
                                <td className="px-4 py-2">{result.student_details.email}</td>
                                <td className="px-4 py-2">{result.student_details.phone_number}</td>
                                <td className="px-4 py-2">{result.marks_obtained}</td>
                                <td className="px-4 py-2">{result.total_marks}</td>
                                <td className="px-4 py-2">{result.student_details.district}</td>
                                <td className="px-4 py-2">{result.student_details.state}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TestResultsById;
