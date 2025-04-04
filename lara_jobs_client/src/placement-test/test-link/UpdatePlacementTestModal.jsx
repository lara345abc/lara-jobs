import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../../config/baseURL";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/20/solid";

const UpdatePlacementTestModal = ({ placement_test_id, show, handleClose }) => {
    const [formData, setFormData] = useState({
        test_id: placement_test_id,
        number_of_questions: "",
        description: "",
        start_time: "",
        end_time: "",
        show_result: true,
        is_Monitored: false,
        topic_ids: [],
        test_title: "",
        certificate_name: "",
        issue_certificate: false,
    });

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        if (placement_test_id && show) {
            fetchTestDetails();
        }
    }, [placement_test_id, show]);

    const fetchTestDetails = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/api/placement-test/test/test-link/${placement_test_id}`
            );
            const data = response.data.data;
            console.log('Response test data : ', response)

            setFormData({
                number_of_questions: data.number_of_questions,
                description: data.description,
                start_time: data.start_time,
                end_time: data.end_time,
                show_result: data.show_result,
                is_Monitored: data.is_Monitored,
                topic_ids: Array.isArray(data.placementTestTopics) ? data.placementTestTopics.map((topic) => topic.topic_id) : [],
                test_title: data.test_title,
                certificate_name: data.certificate_name,
                issue_certificate: data.issue_certificate,
            });

            setTopics(Array.isArray(data.topics) ? data.topics : []); 
        } catch (error) {
            toast.error("Failed to fetch test details");
            console.error("Error fetching test details:", error);
        }
    };

    const handleSubmit = async (e) => {
        // console.log("placement_test_id in submit:", placement_test_id);
        e.preventDefault();
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

            await axios.put(
                `${baseURL}/api/placement-test/test/test-link/update/${placement_test_id}`,
                formData,
                config
            );

            toast.success("Placement test updated successfully!");
            handleClose(); // Close the modal after successful update
        } catch (error) {
            toast.error("Failed to update placement test");
            console.error("Error updating placement test:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value || "",
        });
    };

    return (
        <>
            {show && (
                <div className="fixed inset-0 z-50  items-center justify-center text-black bg-gray-800 bg-opacity-50 scroll-auto flex flex-wrap space-x-4 sm:flex-col sm:space-x-0">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto w-full overflow-y-auto"> 
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold">Update Placement Test</h2>
                            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="w-5 text-dark" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Test Title */}
                            <div>
                                <label htmlFor="testTitle" className="block text-sm font-medium text-gray-700">Test Title</label>
                                <input
                                    type="text"
                                    name="test_title"
                                    value={formData.test_title || ""}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Number of Questions */}
                            <div>
                                <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700">Number of Questions</label>
                                <input
                                    type="number"
                                    name="number_of_questions"
                                    value={formData.number_of_questions || 0}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex space-x-4">
                                {/* Start Time */}
                                <div className="flex-1">
                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* End Time */}
                                <div className="flex-1">
                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        type="datetime-local"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Certificate Name */}
                            <div>
                                <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700">Certificate Name</label>
                                <input
                                    type="text"
                                    name="certificate_name"
                                    value={formData.certificate_name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex space-x-4">
                                {/* Show Result */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="show_result"
                                        checked={formData.show_result}
                                        onChange={handleChange}
                                        className="form-checkbox text-indigo-600"
                                    />
                                    <label htmlFor="showResult" className="text-sm font-medium text-gray-700">Show Result</label>
                                </div>

                                {/* Monitored Test */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_Monitored"
                                        checked={formData.is_Monitored}
                                        onChange={handleChange}
                                        className="form-checkbox text-indigo-600"
                                    />
                                    <label htmlFor="isMonitored" className="text-sm font-medium text-gray-700">Monitored Test</label>
                                </div>

                                {/* Provide Certificate */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="issue_certificate"
                                        checked={formData.issue_certificate}
                                        onChange={handleChange}
                                        className="form-checkbox text-indigo-600"
                                    />
                                    <label htmlFor="isIssueCertificate" className="text-sm font-medium text-gray-700">Provide Certificate</label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Update Test
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>

    );
};

export default UpdatePlacementTestModal;
