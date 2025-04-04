import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config/baseURL';
import { PlusIcon } from '@heroicons/react/20/solid';
import toast from 'react-hot-toast';

const AddQuestions = () => {
    const [topics, setTopics] = useState([]);
    const [placementTestDetails, setPlacementTestDetails] = useState()
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questionData, setQuestionData] = useState({
        question_description: "",
        no_of_marks_allocated: 1,
        difficulty_level: 1,
        options: ["", ""], // Initially two options
        correct_options: []
    });
    const { test_id } = useParams();

    const fetchPlacementTestDetails = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/api/placement-test/test/test-link/${test_id}`,
                // { placement_test_id: test_id },
            );
            setPlacementTestDetails(response.data.data);

        } catch (error) {
            console.log("Error fetching topics by test : ", error)
            if (error.response && error.response.status === 404) {
                toast.error('No Test details found');
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    useEffect(() => {
        const fetchSubjectsAndTopics = async () => {
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
                    {
                        ...config,
                    }
                );

                if (response.data.topics) {
                    setTopics(response.data.topics);
                }
            } catch (error) {
                console.error("Error fetching subjects and topics:", error);
            }
        };

        fetchSubjectsAndTopics();
        fetchPlacementTestDetails();
    }, [test_id]);

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestionData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...questionData.options];
        newOptions[index] = value;
        setQuestionData((prevData) => ({
            ...prevData,
            options: newOptions
        }));
    };



    const addOptionField = () => {
        setQuestionData((prevData) => ({
            ...prevData,
            options: [...prevData.options, ""]
        }));
    };

    const handleCorrectOptionChange = (option, isChecked) => {
        const newCorrectOptions = isChecked
            ? [...questionData.correct_options, option]
            : questionData.correct_options.filter((item) => item !== option);

        setQuestionData((prevData) => ({
            ...prevData,
            correct_options: newCorrectOptions
        }));
    };

    const validateForm = () => {
        const { question_description, options, correct_options } = questionData;

        if (!selectedTopic) {
            toast.error("Please select a topic.");
            return false;
        }

        if (!question_description.trim()) {
            toast.error("Please enter a question description.");
            return false;
        }

        const filledOptions = options.filter(option => option.trim() !== "");

        if (filledOptions.length < 2) {
            toast.error("Please provide at least two options.");
            return false;
        }

        if (correct_options.length === 0) {
            toast.error("Please select at least one correct option.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
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

            // Filter out empty options before sending to backend
            const filteredOptions = questionData.options.filter(option => option.trim() !== "");

            const response = await axios.post(
                `${baseURL}/api/placement-test/questions/saveQuestionAndAddToLink`,
                {
                    ...questionData,
                    options: filteredOptions,
                    topic_id: selectedTopic,
                    placement_test_id: test_id
                },
                config
            );

            console.log("Question added successfully:", response.data);
            toast.success('Question added successfully!');

            // Reset the form fields
            setQuestionData({
                question_description: "",
                no_of_marks_allocated: 1,
                difficulty_level: 1,
                options: ["", ""],
                correct_options: []
            });
        } catch (error) {
            console.error("Error adding question:", error);
            toast.error("Error adding question. Please try again.");
        }
    };

    return (
        <>
            <div className="container mt-3 shadow-md rounded-lg p-6 bg-white text-black">
                <h3 className="text-center py-4 text-xl font-semibold">Add Questions to Placement Test Link</h3>

                {placementTestDetails && (
                    <div className="mb-4">
                        <h5 className="text-lg font-medium">Test Link:
                            <a href={placementTestDetails.test_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                                {placementTestDetails.test_link}
                            </a>
                        </h5>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <h5 className="text-lg font-medium">Subject Name: {topics.length > 0 ? topics[0].subject_name : "N/A"}</h5>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="topicSelect" className="block text-sm font-medium text-gray-700">Select Topic</label>
                            <select
                                id="topicSelect"
                                value={selectedTopic}
                                onChange={handleTopicChange}
                                required
                                disabled={topics.length === 0}
                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Select Topic --</option>
                                {topics.map((topic) => (
                                    <option key={topic.topic_id} value={topic.topic_id}>
                                        {topic.topic_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="marksAllocated" className="block text-sm font-medium text-gray-700">Number of Marks Allocated</label>
                            <input
                                type="number"
                                id="marksAllocated"
                                name="no_of_marks_allocated"
                                value={questionData.no_of_marks_allocated}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                            <input
                                type="number"
                                id="difficultyLevel"
                                name="difficulty_level"
                                value={questionData.difficulty_level}
                                onChange={handleInputChange}
                                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="questionDescription" className="block text-sm font-medium text-gray-700">Question Description</label>
                        <textarea
                            id="questionDescription"
                            name="question_description"
                            value={questionData.question_description}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <h5 className="text-lg font-medium">Options</h5>
                        {questionData.options.map((option, index) => (
                            <div className="mb-3" key={index}>
                                <label htmlFor={`option${index}`} className="block text-sm font-medium text-gray-700">{`Option ${index + 1}`}</label>
                                <textarea
                                    id={`option${index}`}
                                    rows="3"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        ))}
                        <div className="text-center">
                            <span
                                variant="secondary"
                                onClick={addOptionField}
                                className="mb-3 col-6 text-center  px-4 py-2 inline-block cursor-pointer bg-gray-200 rounded-md text-gray-600 hover:bg-gray-300"
                            >
                                <PlusIcon className="w-5 h-5 mr-2 font-bold " />
                                Add one more option
                            </span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5 className="text-lg font-medium">Correct Option(s)</h5>
                        {questionData.options.map((option, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`correctOption${index}`}
                                    name="correct_option"
                                    value={option}
                                    checked={questionData.correct_options.includes(option)}
                                    onChange={(e) => handleCorrectOptionChange(option, e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                />
                                <label htmlFor={`correctOption${index}`} className="ml-2 text-sm text-gray-700">
                                    <pre>{option || `Option ${index + 1}`}</pre>
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            variant="primary"
                            type="submit"
                            className="col-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Question
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddQuestions;
