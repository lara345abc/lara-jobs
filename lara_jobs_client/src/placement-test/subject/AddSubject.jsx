import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon,  TrashIcon } from '@heroicons/react/20/solid';
import { baseURL } from '../../config/baseURL';
import toast from 'react-hot-toast';

const AddSubject = () => {
    const [subjectName, setSubjectName] = useState('');
    const [topicName, setTopicName] = useState('');
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSubjectId, setCurrentSubjectId] = useState(null);
    const [currentTopicId, setCurrentTopicId] = useState(null);
    const [errors, setErrors] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const [showSubjectDeleteConfirmationModal, setShowSubjectDeleteConfirmationModal] = useState(false);
    const [showTopicDeleteConfirmationModal, setShowTopicDeleteConfirmationModal] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState(null);

    const handleAddSubject = () => {
        setIsEditMode(false);
        setShowSubjectModal(true);
    };

    const handleEditSubject = async (subjectId) => {
        try {
            console.log(`Inside handle edit subject`)
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${baseURL}/api/placement-test/subject/getSubjectById/${subjectId}`, config);

            setSubjectName(response.data.data.name);
            setCurrentSubjectId(subjectId);
            setIsEditMode(true);
            setShowSubjectModal(true);
        } catch (error) {
            console.error('Error fetching subject:', error);
        }
    };

    const handleEditTopic = async (topicId) => {
        try {
            console.log(`Inside handle edit topic`)
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${baseURL}/api/placement-test/topic/${topicId}`, config);

            setTopicName(response.data.data.name);
            setCurrentTopicId(topicId);
            setIsEditMode(true);
            setShowTopicModal(true);
        } catch (error) {
            console.error('Error fetching topic:', error);
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        setSubjectToDelete(subjectId);
        setShowSubjectDeleteConfirmationModal(true);
    };

    const handleDeleteTopic = async (topicId) => {
        setTopicToDelete(topicId);
        setShowTopicDeleteConfirmationModal(true);
    };

    const confirmDeleteSubject = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                // data: {
                //     subject_id: subjectToDelete
                // }
            };

            await axios.delete(`${baseURL}/api/placement-test/subject/${subjectToDelete}`, config
            );
            toast.success("Subject Deleted Successfully!!");
            fetchSubjects();
            setShowSubjectDeleteConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting subject:', error);
            toast.error("Something went wrong!!!");
        }
    };


    const confirmDeleteTopic = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                // data: {
                //     topic_id: topicToDelete
                // }
            };
            console.log('topic id to delte ', topicToDelete)

            await axios.delete(`${baseURL}/api/placement-test/topic/delete/${topicToDelete}`,config
               );
            toast.success("Topic Deleted Successfully!!");
            fetchSubjects();
            setShowTopicDeleteConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting topic:', error);
            toast.error("Something went wrong!!!");
        }
    };


    const handleAddTopic = (subjectId) => {
        setCurrentSubjectId(subjectId);
        setIsEditMode(false);
        setShowTopicModal(true);
    };

    const handleCloseModals = () => {
        setShowSubjectModal(false);
        setShowTopicModal(false);
        setShowTopicDeleteConfirmationModal(false);
        setShowSubjectDeleteConfirmationModal(false);
        setErrors('');
        setSubjectName('');
        setTopicName('');
    };

    const handleSubjectSubmit = async (e) => {
        console.log(`Inside handle handle SubjectSubmit`)

        e.preventDefault();
        if (!subjectName.trim()) {
            setErrors('Subject name is required');
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (isEditMode) {
                const response = await axios.put(
                    `${baseURL}/api/placement-test/subject/${currentSubjectId}`,  
                    { subject_name: subjectName.trim() }, 
                    config
                );
                toast.success("Subject Updated");
            } else {
                const response = await axios.post(`${baseURL}/api/placement-test/subject/create`, {
                    name: subjectName
                }, config);
                toast.success("Subject Added");
            }

            fetchSubjects();
            handleCloseModals();
        } catch (error) {
            if (error.response) {
                if (error.response && error.response.data.code === 'SUBJECT_ALREADY_EXISTS') {
                    toast.error('Entered subject already exist');
                    handleCloseModals();
                } else {
                    console.error('Error:', error);
                    handleCloseModals();
                    toast.error("Something went wrong");
                }
            }
        }
    };

    const handleTopicSubmit = async (e) => {
        console.log(`Inside handle topic submit`)

        e.preventDefault();
        if (!topicName.trim()) {
            setErrors('Topic name is required');
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            if (isEditMode) {
                const response = await axios.put(`${baseURL}/api/placement-test/topic/updateTopic`, {
                    topic_id: currentTopicId,
                    topic_name: topicName
                }, config);
                toast.success("Topic Updated");
            } else {
                console.log("current subject id ", currentSubjectId)
                const response = await axios.post(`${baseURL}/api/placement-test/topic/create`, {
                    subjectId: currentSubjectId,
                    topic_name: topicName.trim()
                }, config);
                toast.success("Topic Added");
            }

            fetchSubjects();
            handleCloseModals();
        } catch (error) {
            if (error.response) {
                if (error.response && error.response.data.code === 'TOPIC_NAME_EXIST') {
                    toast.error('Topic already exist for this subject');
                    handleCloseModals();
                } else {
                    console.error('Error:', error);
                    handleCloseModals();
                    toast.error("Something went wrong");
                }
            }
        }
    };

    const fetchSubjects = async () => {
        try {
            console.log(`Inside Fetch subjects`)
            const response = await axios.get(`${baseURL}/api/placement-test/subject/subject-topics`, );
            console.log("Fetched subjects : ", response)
            setSubjects(response.data.data);
            console.log("fetched subjects : ", response)
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Set the number of items per page

    // Calculate the index of the last and first item on the current page
    const indexOfLastSubject = currentPage * itemsPerPage;
    const indexOfFirstSubject = indexOfLastSubject - itemsPerPage;

    // Slice the subjects array to show only the current page items
    const currentSubjects = subjects.slice(indexOfFirstSubject, indexOfLastSubject);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                onClick={handleAddSubject}
            >
                Add Subject
            </button>

            <hr className="my-4 border-gray-300" />

            <table className="min-w-full table-auto bg-white dark:bg-gray-700 rounded-md shadow-md">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Subject Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Topics</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Add Topic</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSubjects.map((subject,index) => (
                        <tr key={index} className="border-b dark:border-gray-600">
                            <td className="px-4 py-2">
                                <div className="flex items-center">
                                    <span className="text-gray-900 dark:text-gray-100">{subject.name}</span>
                                    <div className="ml-2 space-x-2">
                                        <button
                                            className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                                            onClick={() => handleEditSubject(subject.subject_id)}
                                        >
                                            <PencilIcon  className='text-white size-4'/>
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                            onClick={() => handleDeleteSubject(subject.subject_id)}
                                        >
                                            <TrashIcon className='text-white size-4'/>
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-2">
                                <ul>
                                    {subject.topics.map((topic, index) => (
                                        <li key={index} className="mb-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-900 dark:text-gray-100">{topic.name}</span>
                                                <div className="space-x-2">
                                                    <button
                                                        className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                                                        onClick={() => handleEditTopic(topic.topic_id)}
                                                    >
                                                        <PencilIcon className='text-white size-4' />
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                                        onClick={() => handleDeleteTopic(topic.topic_id)}
                                                    >
                                                        <TrashIcon className='text-white size-4' />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-4 py-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    onClick={() => handleAddTopic(subject.subject_id)}
                                >
                                    Add Topic
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <Paginate
                currentPage={currentPage}
                totalItems={subjects.length} // Total number of subjects
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            /> */}

            {/* Modal for Subject */}
            <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${showSubjectModal ? 'block' : 'hidden'}`}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{isEditMode ? 'Edit Subject' : 'Add Subject'}</h2>
                        <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseModals}>X</button>
                    </div>
                    <form onSubmit={handleSubjectSubmit}>
                        <div className="mt-4">
                            <label htmlFor="subjectName" className="block text-sm font-medium text-gray-900 dark:text-gray-100">Subject Name</label>
                            <input
                                type="text"
                                id="subjectName"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                isInvalid={!!errors}
                                required
                            />
                            <p className="text-red-500 text-xs mt-1">{errors}</p>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal for Topic */}
            <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${showTopicModal ? 'block' : 'hidden'}`}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{isEditMode ? 'Edit Topic' : 'Add Topic'}</h2>
                        <button className="text-gray-500 hover:text-gray-700" onClick={handleCloseModals}>X</button>
                    </div>
                    <form onSubmit={handleTopicSubmit}>
                        <div className="mt-4">
                            <label htmlFor="topicName" className="block text-sm font-medium text-gray-900 dark:text-gray-100">Topic Name</label>
                            <input
                                type="text"
                                id="topicName"
                                value={topicName}
                                onChange={(e) => setTopicName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                isInvalid={!!errors}
                                required
                            />
                            <p className="text-red-500 text-xs mt-1">{errors}</p>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            {/* Confirmation Modals */}
            <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${showSubjectDeleteConfirmationModal ? 'block' : 'hidden'}`}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Delete</h2>
                    <p className="mt-4 text-gray-900 dark:text-gray-100">Are you sure you want to delete this subject and all its topics?</p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                            onClick={() => setShowSubjectDeleteConfirmationModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            onClick={confirmDeleteSubject}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${showTopicDeleteConfirmationModal ? 'block' : 'hidden'}`}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Delete</h2>
                    <p className="mt-4 text-gray-900 dark:text-gray-100">Are you sure you want to delete this topic? This will delete all the questions related to this topic.</p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                            onClick={() => setShowTopicDeleteConfirmationModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            onClick={confirmDeleteTopic}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default AddSubject;
