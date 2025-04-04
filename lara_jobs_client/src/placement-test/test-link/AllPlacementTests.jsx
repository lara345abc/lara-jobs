import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UpdatePlacementTestModal from './UpdatePlacementTestModal';
import toast from 'react-hot-toast';
import {  ClipboardIcon } from '@heroicons/react/20/solid';
import { getAllPlacementTests, toggleLinkStatus, updateMonitoredStatus, updateNumberOfQuestions } from '../../api/placementTest';

const AllPlacementTests = () => {
    const [placementTests, setPlacementTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [newQuestionCount, setNewQuestionCount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(10);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        variant: '',
    });

    useEffect(() => {
        const fetchPlacementTests = async () => {
            try {
                const tests = await getAllPlacementTests();
                // Sort tests
                const sortedTests = tests.sort((a, b) => {
                    if (b.is_Active === a.is_Active) {
                        return b.placement_test_id - a.placement_test_id;
                    }
                    return b.is_Active - a.is_Active;
                });
                setPlacementTests(sortedTests);
            } catch (error) {
                console.error('Error fetching placement tests:', error);
            }
        };

        fetchPlacementTests();

        return () => {
            toast.dismiss();
        };
    }, []);

    const handleOpenModal = (testId) => {
        setSelectedTestId(testId);
        setShowUpdateModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setSelectedTestId(null);
    };

    const copyTestLinkToClipboard = (testLink) => {
        navigator.clipboard.writeText(testLink)
            .then(() => {
                toast.success('Test link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    const handleEditClick = (test) => {
        setSelectedTest(test);
        setNewQuestionCount(test.number_of_questions);
        setShowModal(true);
    };

    const handleSaveQuestions = async () => {
        try {
            await updateNumberOfQuestions(selectedTest.placement_test_id, newQuestionCount);
            toast.success('Number of questions updated successfully');
            setShowModal(false);
            const tests = await getAllPlacementTests();
            setPlacementTests(tests);
        } catch (error) {
            console.error('Error updating number of questions:', error);
            toast.error('Failed to update number of questions');
        }
    };

    const toggleTestLinkStatus = async (placement_test_id, currentStatus) => {
        try {
            const newStatus = await toggleLinkStatus(placement_test_id, currentStatus);
            setAlert({
                show: true,
                message: `Link ${newStatus ? 'activated' : 'deactivated'} successfully`,
                variant: 'success',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const tests = await getAllPlacementTests();
            setPlacementTests(tests);
        } catch (error) {
            console.error('Error toggling link status:', error);
            setAlert({
                show: true,
                message: 'Failed to update link status',
                variant: 'danger',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleMonitoredChange = async (test) => {
        try {
            const updatedStatus = !test.is_Monitored;
            await updateMonitoredStatus(test.placement_test_id, updatedStatus);
            const updatedTests = placementTests.map(t =>
                t.placement_test_id === test.placement_test_id ? { ...t, is_Monitored: updatedStatus } : t
            );
            toast.success('Updated status successfully')
            setPlacementTests(updatedTests);
            if (updatedStatus) {
                toast.success('Camera Monitoring is on ')
            }
        } catch (error) {
            console.error('Error updating monitored status:', error);
            toast.error('Failed to update monitored status');
        }
    };

    const totalPages = Math.ceil(placementTests.length / testsPerPage);
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = placementTests.slice(indexOfFirstTest, indexOfLastTest);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render pagination items with ellipsis for large number of pages
    // const renderPaginationItems = () => {
    //     let items = [];
    //     const maxVisiblePages = 5; // Maximum visible pages before adding ellipsis

    //     if (totalPages <= maxVisiblePages) {
    //         // Show all pages if total pages are less than maxVisiblePages
    //         for (let number = 1; number <= totalPages; number++) {
    //             items.push(
    //                 <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
    //                     {number}
    //                 </Pagination.Item>
    //             );
    //         }
    //     } else {
    //         // Show the first page
    //         items.push(
    //             <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
    //                 1
    //             </Pagination.Item>
    //         );

    //         // Show ellipsis if the current page is far from the first page
    //         if (currentPage > 3) {
    //             items.push(<Pagination.Ellipsis key="left-ellipsis" />);
    //         }

    //         // Show a range of pages around the current page
    //         const pageRange = [currentPage - 1, currentPage, currentPage + 1].filter(
    //             (page) => page >= 2 && page <= totalPages - 1
    //         );
    //         pageRange.forEach((page) => {
    //             items.push(
    //                 <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
    //                     {page}
    //                 </Pagination.Item>
    //             );
    //         });

    //         // Show ellipsis if the current page is far from the last page
    //         if (currentPage < totalPages - 2) {
    //             items.push(<Pagination.Ellipsis key="right-ellipsis" />);
    //         }

    //         // Show the last page
    //         items.push(
    //             <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
    //                 {totalPages}
    //             </Pagination.Item>
    //         );
    //     }
    //     return items;
    // };



    return (
        <>
            {alert.show && (
                <div
                    className={`alert ${alert.variant === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} p-4 rounded-md`}
                >
                    <div className="flex justify-between items-center">
                        <span>{alert.message}</span>
                        <button className="ml-2 text-lg" onClick={() => setAlert({ show: false })}>
                            &times;
                        </button>
                    </div>
                </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center my-2">All Placement Tests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300 text-gray-800 dark:text-white">
                    <thead>
                        <tr>
                            <th className="px-1 text-sm py-2 border-b">ID</th>
                            <th className="px-1 text-sm py-2 border-b" style={{ width: "fit-content" }}>Test Link</th>
                            {/* <th className="px-1 text-sm py-2 border-b">Number of Questions</th> */}
                            <th className="px-1 text-sm py-2 border-b">Camera Monitoring</th>
                            <th className="px-1 text-sm py-2 border-b">Update Details</th>
                            <th className="px-1 text-sm py-2 border-b">Results</th>
                            <th className="px-1 text-sm py-2 border-b">Add Existing Questions</th>
                            <th className="px-1 text-sm py-2 border-b">Add New Questions</th>
                            <th className="px-1 text-sm py-2 border-b">Upload Questions</th>
                            <th className="px-1 text-sm py-2 border-b">Edit Questions</th>
                            <th className="px-1 text-sm py-2 border-b">Activate Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTests.map(test => (
                            <tr
                                key={test.placement_test_id}
                                className={test.is_Active ? "bg-green-400 animate-to-top" : ""}
                            >
                                <td className="px-2 py-2 border-b">
                                    {test.placement_test_id}
                                    {test.placement_test_id === Math.max(...placementTests.map(t => t.placement_test_id)) && (
                                        <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                                            New
                                        </span>
                                    )}
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <div className="relative">
                                        <div className="tooltip" data-tooltip={test.test_link}>
                                            <p className="truncate max-w-xs">{test.test_title}</p>
                                        </div>
                                        {test.is_Active && (
                                            <button
                                                className="text-blue-500 ml-2"
                                                onClick={() => copyTestLinkToClipboard(test.test_link)}
                                            >
                                                <ClipboardIcon className='w-4 text-black' />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                {/* <td className="px-2 py-2 border-b">
                                    {test.number_of_questions}
                                    <button
                                        className="ml-2 p-1 bg-gray-200 text-gray-600 rounded-full"
                                        onClick={() => handleEditClick(test)}
                                    >
                                        <PencilIcon />
                                    </button>
                                </td> */}
                                <td className="px-2 py-2 border-b">
                                    <input
                                        type="checkbox"
                                        checked={test.is_Monitored}
                                        onChange={() => handleMonitoredChange(test)}
                                        className="form-checkbox h-5 w-5 text-blue-500"
                                    />
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <button
                                        onClick={() => handleOpenModal(test.placement_test_id)}
                                        className="bg-blue-500 text-white py-1 px-2 rounded-md"
                                    >
                                        Update details
                                    </button>
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <Link
                                        to={`/admin/test/get-result/${test.placement_test_id}`}
                                        className="text-white"
                                    >
                                        Results
                                    </Link>
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <Link
                                        to={`/admin/test/add-existing-questions/${test.placement_test_id}`}
                                        className="text-white"
                                    >
                                        Add Existing Questions
                                    </Link>
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <Link
                                        to={`/admin/test/add-new-question/${test.placement_test_id}`}
                                        className="text-white"
                                    >
                                        Add New Questions
                                    </Link>
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <Link
                                        to={`/admin/test/upload-excel-link/${test.placement_test_id}`}
                                        className="text-white"
                                    >
                                        Upload Questions
                                    </Link>
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <Link
                                        to={`/admin/test/edit-question/${test.placement_test_id}`}
                                        className="text-white"
                                    >
                                        Edit Questions
                                    </Link>
                                </td>
                                <td className="px-2 py-2 border-b">
                                    <button
                                        className={`py-1 px-2 rounded-md text-white ${test.is_Active ? 'bg-green-500' : 'bg-red-500'}`}
                                        onClick={() => toggleTestLinkStatus(test.placement_test_id, test.is_Active)}
                                    >
                                        {test.is_Active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <UpdatePlacementTestModal
                placement_test_id={selectedTestId}
                show={showUpdateModal}
                handleClose={handleCloseModal}
            />

            {/* Tailwind Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-2 py-2 text-white bg-gray-500 rounded-l-md cursor-pointer"
                >
                    Prev
                </button>
                {/* Pagination */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-2 py-2 text-white bg-gray-500 rounded-r-md cursor-pointer"
                >
                    Next
                </button>
            </div>

            {/* Tailwind Modal */}
            <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black ${showModal ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h3 className="text-xl font-semibold">Update Number of Questions</h3>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-lg text-gray-500"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="numberOfQuestions" className="block text-sm font-semibold text-gray-700">Number of Questions</label>
                            <input
                                id="numberOfQuestions"
                                type="number"
                                value={newQuestionCount}
                                onChange={(e) => setNewQuestionCount(e.target.value)}
                                className="mt-2 block w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-2 py-2 bg-gray-300 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveQuestions}
                            className="px-2 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AllPlacementTests;