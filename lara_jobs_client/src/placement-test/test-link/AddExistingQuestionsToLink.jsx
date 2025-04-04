import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { baseURL } from '../../config/baseURL';

const ITEMS_PER_PAGE = 10;

const AddExistingQuestionsToLink = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [placementTestDetails, setPlacementTestDetails] = useState();
    const { test_id } = useParams();

    const fetchPlacementTestDetails = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/api/placement-test/test/test-link/${test_id}`,
                // { placement_test_id: test_id },
            );
            setPlacementTestDetails(response.data);
            // console.log('details ', response.data.data)
        } catch (error) {
            console.error("Error fetching test :", error)
            if (error.response && error.response.status === 404) {
                toast.error('No Test details found')
            } else {
                toast.error('Something went wrong')
            }
        }
    }

    useEffect(() => {
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
                console.log("test id ", test_id)
                const response = await axios.post(
                    `${baseURL}/api/placement-test/topic/topics-assignedto-test`,
                    { placement_test_id: test_id },
                    {
                        ...config,
                    }
                );

                if (response.data.topics) {
                    setTopics(response.data.topics);
                } else {
                    toast.error("No topics found for this placement test.");
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
                toast.error(error.message);
            }
        };

        fetchTopicsByPlacementTestId();
        fetchPlacementTestDetails();
    }, [test_id]);

    const handleTopicChange = async (e) => {
        const topicId = e.target.value;
        setSelectedTopic(topicId);

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
                `${baseURL}/api/placement-test/questions/getQuestionsByTopicId`,
                { topic_id: topicId },
                config
            );

            const fetchedQuestions = response.data.questions;
            setQuestions(fetchedQuestions);
            setTotalPages(Math.ceil(fetchedQuestions.length / ITEMS_PER_PAGE));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('No Questions found for the selected Topic')
            } else {
                console.error("Error fetching questions:", error);
                toast.error(error.message);
            }

        }
    };

    const handleCheckboxChange = (questionId) => {
        const isSelected = selectedQuestions.includes(questionId);
        if (isSelected) {
            setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
        } else {
            setSelectedQuestions([...selectedQuestions, questionId]);
        }
    };

    const handleAddQuestions = async () => {
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

            const requestBody = {
                placement_test_id: test_id,
                question_ids: selectedQuestions,
            };
            // const response = await axios.post(`${baseURL}api/placement-test/test/test-link/assign-selected-questions`,requestBody);

            const response = await axios.post(
                `${baseURL}/api/placement-test/test/test-link/assign-selected-questions`,
                { placement_test_id : test_id, question_ids : selectedQuestions },
            );

            toast.success("Assigned successsfully");
        } catch (error) {
            console.error("Error adding questions:", error);
            toast.error(error.message);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSelectAll = () => {
        setSelectedQuestions(questions.map(question => question.cumulative_question_id));
    };

    const handleSelectRandomQuestions = () => {
        const randomQuestions = [...questions];
        if (randomQuestions.length > 45) {
            const shuffled = randomQuestions.sort(() => 0.5 - Math.random());
            setSelectedQuestions(shuffled.slice(0, 45).map(question => question.cumulative_question_id));
        } else {
            setSelectedQuestions(randomQuestions.map(question => question.cumulative_question_id));
        }
    };

    const paginatedQuestions = questions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // const renderPagination = () => {
    //     let items = [];
    //     const startPage = Math.max(1, currentPage - 2);
    //     const endPage = Math.min(totalPages, currentPage + 2);

    //     for (let number = startPage; number <= endPage; number++) {
    //         items.push(
    //             <Pagination.Item
    //                 key={number}
    //                 active={number === currentPage}
    //                 onClick={() => handlePageChange(number)}
    //             >
    //                 {number}
    //             </Pagination.Item>
    //         );
    //     }

    //     return items;
    // };

    return (
        <>
            <div className="my-4">
                <div className="container">
                    {placementTestDetails && (
                        <div className="mb-3 flex flex-wrap">
                            <div className="my-3 w-full md:w-5/12">
                                <h5>
                                    Test Link:{" "}
                                    <a
                                        href={placementTestDetails.data.test_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {placementTestDetails.data.test_link}
                                       
                                    </a>
                                </h5>
                            </div>
                            <Link
                                to={`/admin/test/add-new-question/${placementTestDetails.data.placement_test_id}`}
                                className="w-full md:w-5/12"
                            >
                                <span className="btn btn-outline-primary">Add New Questions for this test link</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap mb-3">
                    <div className="w-full md:w-1/2 mb-3">
                        <h5>Subject: {topics.length > 0 ? topics[0].subject_name : "N/A"}</h5>
                    </div>

                    <div className="w-full md:w-1/2 mb-3 text-black">
                        <label htmlFor="topicSelect" className="block mb-2 text-white">Select Topic</label>
                        <select
                            id="topicSelect"
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            required
                            disabled={topics.length === 0}
                            className="w-full border rounded-md p-2"
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

                <div className="flex space-x-4 mb-3">
                    <div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={handleSelectAll}
                        >
                            Select All
                        </button>
                    </div>
                    <div>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            onClick={handleSelectRandomQuestions}
                        >
                            Select Random 45 Questions
                        </button>
                    </div>
                    <div>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            onClick={handleAddQuestions}
                            disabled={selectedQuestions.length === 0}
                        >
                            Add the selected Questions
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    <h4>Available Questions:</h4>
                    {questions.length === 0 ? (
                        <p>No questions available for the selected topic.</p>
                    ) : (
                        <>
                            <ul>
                                {paginatedQuestions.map((question) => (
                                    <li
                                        key={question.cumulative_question_id}
                                        className="my-2 border p-2"
                                        style={{ listStyle: "none" }}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`question-${question.cumulative_question_id}`}
                                            className="mr-2"
                                            checked={selectedQuestions.includes(question.cumulative_question_id)}
                                            onChange={() => handleCheckboxChange(question.cumulative_question_id)}
                                        />
                                        <label htmlFor={`question-${question.cumulative_question_id}`}>
                                            {question.question_description}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-center my-4">
                                {/* <Pagination>{renderPagination()}</Pagination> */}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </>
    );
};

export default AddExistingQuestionsToLink;
