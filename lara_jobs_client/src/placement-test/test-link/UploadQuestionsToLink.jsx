import React, { useState, useEffect } from 'react';
import axios from 'axios';
import image from '../../assets/excel-sheet-example.png';
// import excehlsheetWitoutId from '../../assets/excelsheet_without_topic_id.xlsx'
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { baseURL } from '../../config/baseURL';
// import UploadQuestionsToLinkByTopicIds from './UploadQuestionsToLinkByTopicIds';

const UploadQuestionsToLink = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [subject, setSubject] = useState('');
    const { test_id } = useParams();
    const [placementTestDetails, setPlacementTestDetails] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResponse, setUploadResponse] = useState(null);

    useEffect(() => {
        const fetchPlacementTestDetails = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/api/placement-test/test/test-link/${test_id}`,
                    // { test_id: test_id }
                );
                // console.log("Test details : ", response)
                setSubject(response.data.data.test_link);
                setPlacementTestDetails(response.data.data);
            } catch (error) {
                console.error("Error fetching test details : ", error)
                if (error.response && error.response.status === 404) {
                    toast.error('No Test details found');
                } else {
                    toast.error('Something went wrong');
                }
            }
        };

        const fetchTopicsByPlacementTestId = async () => {
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

                const response = await axios.post(
                    `${baseURL}/api/placement-test/topic/topics-assignedto-test`,
                    { placement_test_id: test_id },
                    config
                );
                console.log("Response test details : ", response.data)
                if (response.data.topics) {
                    setTopics(response.data.topics);
                } else {
                    toast.error("No topics found for this placement test.");
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.error('No topics added for this link');
                } else {
                    console.error("Error fetching topics:", error);
                    toast.error(error.message);
                }

            }
        };

        fetchTopicsByPlacementTestId();
        fetchPlacementTestDetails();
    }, [test_id]);

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedExtensions = ['xlsx', 'xls'];

        if (selectedFile) {
            const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                toast.error("Invalid file type. Please upload an .xlsx or .xls file.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a valid file to upload.");
            return;
        }

        setIsUploading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            };

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${baseURL}/api/placement-test/questions/upload-questions-link`, formData, {
                params: {
                    topic_id: selectedTopic,
                    placement_test_id: test_id
                },
                ...config,
            });

            toast.success("Questions uploaded successfully!");
            setUploadResponse(response.data);
        } catch (error) {
            console.error('Error uploading questions:', error);
            toast.error("Something went wrong while uploading the questions.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/excelsheet_without_topic_id.xlsx';
        link.download = 'example_excel_sheet_without_topic_id.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Example Excel sheet downloaded successfully!');
    };

    return (
        <div className="px-4 py-6">

            {placementTestDetails && (
                <div className="my-6 flex justify-between items-center">
                    <div className="my-3 w-full md:w-1/2">
                        <h5 className="text-lg font-semibold">Test Link:
                            <a href={placementTestDetails.test_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {placementTestDetails.test_link}
                            </a>
                        </h5>
                    </div>
                    <Link to={`/admin/test/add-new-question/${placementTestDetails.placement_test_id}`} className="w-full md:w-1/2">
                        <span className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md">
                            Add New Questions for this test link
                        </span>
                    </Link>
                </div>
            )}

            <div className="flex">
                <div className="w-full md:w-1/2">
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="mb-3">
                            <h5 className="text-xl font-semibold">
                                Subject: {topics.length > 0 ? topics[0].subject_name : "N/A"}
                            </h5>
                        </div>

                        <p className="text-lg leading-relaxed">
                            Upload questions by selecting a specific topic
                        </p>
                        <div className="mb-4">
                            <label htmlFor="topicSelect" className="block text-sm font-medium ">Select Topic</label>
                            <select
                                id="topicSelect"
                                value={selectedTopic}
                                onChange={handleTopicChange}
                                className="mt-1 block w-full p-3 border-2 text-black border-gray-300 rounded-md"
                                required
                                disabled={!subject}
                            >
                                <option value="">-- Select Topic --</option>
                                {topics.map((topic, index) => (
                                    <option key={index} value={topic.topic_id}>
                                        {topic.topic_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="mt-3 bg-blue-300 text-black hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md"
                            onClick={handleShowModal}
                        >
                            Example Excel Sheet Format to Upload
                        </button>

                        <button
                            type="button"
                            className="mt-3 bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
                            onClick={handleDownload}
                        >
                            Download Example Excel Sheet
                        </button>

                        <div className="mb-4">
                            <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload Questions</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-1 block w-full p-3 border-2 border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`mt-3 w-full bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md ${!selectedTopic || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!selectedTopic || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {uploadResponse && (
                <div className="mt-6">
                    <h5 className="text-xl font-semibold">Upload Summary</h5>
                    <p>Total Questions: {uploadResponse.summary.totalQuestions}</p>
                    <p>Successfully Uploaded: {uploadResponse.summary.successfullyUploaded}</p>
                    <p>Successfully Assigned: {uploadResponse.summary.successfullyAssigned}</p>
                    <p>Skipped Questions: {uploadResponse.summary.skippedQuestionsCount}</p>

                    {uploadResponse.skippedQuestions.length > 0 && (
                        <div className="overflow-x-auto bg-white shadow rounded-md mt-4">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="px-4 py-2">Question</th>
                                        <th className="px-4 py-2">Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadResponse.skippedQuestions.map((q, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">{q.questionText}</td>
                                            <td className="px-4 py-2">{q.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Section */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Example Excel Sheet</h2>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <img src={image} alt="Example Excel Sheet" className="w-full h-auto" />
                        <div className="mt-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <UploadQuestionsToLinkByTopicIds /> */}
        </div>

    );
};

export default UploadQuestionsToLink;