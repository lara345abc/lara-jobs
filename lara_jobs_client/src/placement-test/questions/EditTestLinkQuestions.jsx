import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { baseURL } from '../../config/baseURL';
import toast from 'react-hot-toast';
import { ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

const EditTestLinkQuestions = () => {
    const [questionsWithOptions, setQuestionsWithOptions] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [formData, setFormData] = useState({ question_description: '', options: [], correct_answers: [] });
    const { test_id } = useParams();
    const [placementTestDetails, setPlacementTestDetails] = useState();

    useEffect(() => {
        const fetchPlacementTestDetails = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/api/placement-test/test/test-link/${test_id}`,
                    // { placement_test_id: test_id },
                );
                setPlacementTestDetails(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.info('No Test details found');
                } else {
                    toast.error('Something went wrong');
                }
            }
        };

        fetchPlacementTestDetails();
    }, [test_id]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.post(`${baseURL}/api/placement-test/questions/fetchQuestionsByTestId`, {
                    placement_test_id: test_id
                });
                console.log("Questions ", response)
                const formattedQuestions = response.data.map(question => ({
                    ...question,
                    options: question.QuestionOptions.map(opt => ({
                        option_id: opt.option_id,
                        option_description: opt.option_description
                    })),
                    correct_answers: question.CorrectAnswers.map(ans => ans.answer_description)
                }));

                setQuestionsWithOptions(formattedQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();

    }, [test_id]);

    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setFormData({
            question_description: question.question_description,
            options: question.options,
            correct_answers: question.correct_answers
        });
        setShowEditModal(true);
    };

    const handleDelete = async (questionId) => {
        try {
            console.log("Question ID : ", questionId)
            await axios.delete(`${baseURL}/api/placement-test/questions/delete-question/${questionId}`);
            setQuestionsWithOptions(questionsWithOptions.filter(q => q.cumulative_question_id !== questionId));
            toast.success("Question deleted successfully"); 
        } catch (error) {
            console.error("Error deleting question:", error);
            toast.error("Error deleting question"); 
        }
    };

    const handleAddOption = () => {
        setFormData(prevData => ({
            ...prevData,
            options: [...prevData.options, { option_id: Date.now(), option_description: '' }]
        }));
    };

    const handleChange = (e, index) => {
        const { name, value, checked } = e.target;
        if (name === 'question_description') {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        } else if (name === 'option_description') {
            setFormData(prevData => {
                const newOptions = [...prevData.options];
                newOptions[index].option_description = value;
                return { ...prevData, options: newOptions };
            });
        } else if (name === 'correct_answers') {
            setFormData(prevData => ({
                ...prevData,
                correct_answers: checked
                    ? [...prevData.correct_answers, value]
                    : prevData.correct_answers.filter(answer => answer !== value)
            }));
        }
    };

    const handleUpdate = async () => {
        try {
            // Filter out empty options before sending to backend
            const nonEmptyOptions = formData.options.filter(option => option.option_description.trim() !== '');

            await axios.post(`${baseURL}/api/placement-test/questions/update-question`, {
                ...selectedQuestion,
                ...formData,
                options: nonEmptyOptions // Send only non-empty options
            });

            // Update the local state
            setQuestionsWithOptions(questionsWithOptions.map(q =>
                q.placement_question_id === selectedQuestion.placement_question_id
                    ? { ...q, ...formData, options: nonEmptyOptions }
                    : q
            ));
            setShowEditModal(false);
            toast.success("Question updated successfully"); // Success message
        } catch (error) {
            console.error("Error updating question:", error);
            toast.error("Error updating question"); // Error message
        }
    };

    return (
        <div className="container mt-20">
            <div className="container">
                {placementTestDetails && (
                    <div className="mb-6 flex justify-between items-center">
                        <div className="my-3 w-3/5">
                            <h5>Test Link:
                                <a href={placementTestDetails.test_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {placementTestDetails.test_link}
                                </a>
                            </h5>
                        </div>
                        <Link to={`/admin/test/add-new-question/${test_id}`} className="w-2/5 text-center">
                            <span className="btn btn-outline-primary text-white border border-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md">Add New Questions for this test link</span>
                        </Link>
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-semibold mb-4">Edit Test Link Questions</h3>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-left">#</th>
                            <th className="border px-4 py-2 text-left">Question</th>
                            <th className="border px-4 py-2 text-left">Options</th>
                            <th className="border px-4 py-2 text-left">Correct Answers</th>
                            <th className="border px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionsWithOptions.map((question, index) => {
                            const optionDescriptions = question.options.map(opt => opt.option_description);
                            const hasMismatch = question.correct_answers.some(correct => !optionDescriptions.includes(correct));

                            return (
                                <tr key={index} className={hasMismatch ? 'bg-red-600 text-white' : ''}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2 overflow-x-auto text-wrap" style={{ maxWidth: '60vw' }}>
                                        <pre>{question.question_description}</pre>
                                        {hasMismatch && (
                                            <div className="mt-2 flex items-center">
                                                <div className="bg-yellow-400 text-black px-2 py-1 rounded-md text-sm">
                                                    Available options and correct options are not matching. Delete this question and add it again.
                                                </div>
                                                <ExclamationCircleIcon className="bg-red-600 text-white ml-2 rounded-full p-2 text-xl" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {question.options.map((option, idx) => (
                                            <div key={idx}>
                                                <pre>{option.option_description}</pre>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {question.correct_answers.join(', ')}
                                    </td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        <button variant="primary" onClick={() => handleEdit(question)} className="bg-blue-500 text-white hover:bg-blue-700 rounded-md p-2">
                                            <PencilIcon  className='w-4 '/>
                                        </button>
                                        <button variant="danger" onClick={() => handleDelete(question.cumulative_question_id)} className="bg-red-500 text-white hover:bg-red-700 rounded-md p-2">
                                            <TrashIcon  className='w-4 '/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Edit Question Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 overflow-y-auto text-black overflow-x-auto">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h5 className="text-lg font-semibold">Edit Question</h5>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-xl hover:text-red-600"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <form>
                                {/* Question Description */}
                                <div className="mb-4 overflow-x-auto">
                                    <label
                                        htmlFor="question_description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Question Description
                                    </label>
                                    <textarea
                                        name="question_description"
                                        value={formData.question_description}
                                        onChange={(e) => handleChange(e)}
                                        rows={4}
                                        placeholder="Enter question description"
                                        className="mt-1 block w-full p-2 border-2 border-gray-300 rounded-md overflow-x-auto"
                                    />
                                </div>

                                {/* Options */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Options
                                    </label>
                                    {formData.options.map((option, index) => (
                                        <div key={option.option_id} className="flex items-center space-x-4 mb-3">
                                            <input
                                                type="text"
                                                name="option_description"
                                                value={option.option_description}
                                                onChange={(e) => handleChange(e, index)}
                                                className="block w-3/4 p-2 border-2 border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="checkbox"
                                                name="correct_answers"
                                                value={option.option_description}
                                                checked={formData.correct_answers.includes(option.option_description)}
                                                onChange={(e) => handleChange(e)}
                                                className="ml-2"
                                            />
                                            <label className="ml-2 text-sm">Correct Answer</label>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded-md"
                                    >
                                        Add Option
                                    </button>
                                </div>

                                {/* Update Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleUpdate}
                                        className="bg-blue-500 text-white hover:bg-blue-700 px-6 py-2 rounded-md"
                                    >
                                        Update Question
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditTestLinkQuestions;
