import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { baseURL } from '../../config/baseURL';
import OnlineTestMonitoring from './OnlineTestMonitoring';
import InActiveTest from './InActiveTest';
import toast from 'react-hot-toast';
import { hasCandidateAttended } from '../../api/placementTest';
import EmailForm from '../../components/signUp/EmailForm';


const PlacementTest = () => {
    const [loading, setLoading] = useState(true);
    const [testDetails, setTestDetails] = useState()
    const [isTestActive, setIsTestActive] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [testResults, setTestResults] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [obtainedMarks, setObtainedMarks] = useState(0);
    const { test_id } = useParams();
    const [showResult, setShowResult] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0); // Timer state
    const [autoSubmit, setAutoSubmit] = useState(false); // Auto-submit state
    const timerRef = useRef(null); // Timer reference
    const navigate = useNavigate();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMonitored, setIsMonitored] = useState(false);
    const [isIssueCertificate, setIsIssueCertificate] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [testAttendedStatus, setTestAttendedStatus] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);



    useEffect(() => {
        const emailVerified = sessionStorage.getItem('isEmailVerified');
        if (emailVerified === 'true') {
            setIsEmailVerified(true);
        }
        sessionStorage.setItem('redirectUrl', window.location.pathname);
    }, []);

    //code to prevent open new tab and opening the context menu 

    // useEffect(() => {

    //     const handleVisibilityChange = async () => {
    //         if (!showSummary && document.hidden && !isSubmitting) {
    //             setIsCameraOn(false);
    //             setIsMonitored(false);
    //             setAutoSubmit(true);

    //             // Evaluate answers and calculate obtained marks before submitting
    //             await handleSubmitTest();

    //             navigate('/malpractice-detected');
    //         }
    //     };

    //     const handlePopState = async () => {
    //         if (!showSummary && !isSubmitting) {
    //             setAutoSubmit(true);

    //             // Evaluate answers and calculate obtained marks before submitting
    //             await handleSubmitTest();

    //             navigate('/malpractice-detected');
    //         }
    //     };

    //     const setupListeners = () => {
    //         document.addEventListener("visibilitychange", handleVisibilityChange);
    //         window.addEventListener("popstate", handlePopState);
    //     };

    //     const cleanupListeners = () => {
    //         document.removeEventListener("visibilitychange", handleVisibilityChange);
    //         window.removeEventListener("popstate", handlePopState);
    //     };

    //     setupListeners();

    //     return () => {
    //         cleanupListeners();
    //     };
    // }, [navigate, showSummary, isSubmitting]);


    // useEffect(() => {


    //     const disableRightClick = (event) => {
    //         event.preventDefault();
    //     };

    //     const disableDevTools = (event) => {
    //         // Block F12
    //         if (event.key === "F12") {
    //             event.preventDefault();
    //         }
    //         // Block Ctrl + Shift + I
    //         if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
    //             event.preventDefault();
    //         }
    //     };

    //     const disableSelection = (event) => {
    //         event.preventDefault();
    //     };

    //     const disableCopy = (event) => {
    //         event.preventDefault();
    //     };

    //     const setupListeners = () => {
    //         document.addEventListener("contextmenu", disableRightClick); // Disable right-click
    //         document.addEventListener("keydown", disableDevTools); // Block dev tools
    //         document.addEventListener("selectstart", disableSelection); // Disable text selection
    //         document.addEventListener("copy", disableCopy); // Disable copying
    //     };

    //     const cleanupListeners = () => {
    //         document.removeEventListener("contextmenu", disableRightClick);
    //         document.removeEventListener("keydown", disableDevTools);
    //         document.removeEventListener("selectstart", disableSelection);
    //         document.removeEventListener("copy", disableCopy);
    //     };

    //     setupListeners();

    //     return () => {
    //         cleanupListeners();
    //     };
    // }, [isEmailVerified]);

    // code to prevent open new tab and opening the context menu ends 

   


    const showAlert = () => {
        alert("Allow camera and microphone access inorder to attend the test")
    }
    let marksForCertificate;

    const fetchTestDetails = async () => {
        try {
            const response1 = await axios.post(`${baseURL}/api/placement-test/test/test-link/fetchTestTopicIdsAndQnNums`, {
                encrypted_test_id: test_id,
            });
            setTestDetails(response1.data);
            const { topic_ids, number_of_questions, show_result, is_Monitored, whatsAppChannelLink, test_title, certificate_name, issue_certificate } = response1.data;
            setIsTestActive(true);
            setShowResult(show_result);
            setIsMonitored(is_Monitored);
            setIsIssueCertificate(issue_certificate);

            if (!show_result) {
                setShowSummary(false);
            }

            const response2 = await axios.post(`${baseURL}/api/placement-test/questions/fetchQuestionsByTestId`, {
                placement_test_id: test_id,
            });

            const questionsWithOptions = response2.data.map((question) => ({
                ...question,
                options: question.QuestionOptions.map((opt) => ({
                    option_id: opt.option_id,
                    option_description: opt.option_description,
                })),
                correct_answers: question.CorrectAnswers.map((ans) => ans.answer_description),
            }));

            // Shuffle questions
            const shuffledQuestions = shuffleArray(questionsWithOptions);
            setQuestions(shuffledQuestions);

            const totalMarks = shuffledQuestions.reduce(
                (sum, question) => sum + question.no_of_marks_allocated,
                0
            );
            setTotalMarks(totalMarks);

            // Set the timer based on the number of questions
            const initialTime = number_of_questions * 60; // 1 minute per question
            setRemainingTime(initialTime);

            setLoading(false);
        } catch (error) {
            console.log("Error fetching test details: ", error);
            if (error.response) {
                if (error.response.data.code === 'FORBIDDEN') {
                    setLoading(false);
                    setIsTestActive(false);
                } else if (error.response.status === 404) {
                    navigate('/not-found');
                }
            } else {
                console.error('Error fetching test details:', error);
                setLoading(false);
            }
        }
    };

    const hasAttended = async (test_id) => {
        try {
            const isAttended = await hasCandidateAttended(test_id);
            console.log("Is attended ", isAttended);
            setTestAttendedStatus(isAttended);
        } catch (error) {
            console.error("Error while checking if test was attended: ", error);
        }
    };

    useEffect(() => {
        // Check if the user has already attended the test
        const checkAttendance = async () => {
            await hasAttended(test_id);

            if (testAttendedStatus) {
                toast.error('You have already attended this test. You can download the certificate in your dashboard.');
                navigate('/common-dashboard');
            } else {
                fetchTestDetails();
            }
        };

        checkAttendance();

        // Cleanup timer if the component unmounts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [test_id, testAttendedStatus]);


    // Utility function to shuffle the array
    const shuffleArray = (array) => {
        const shuffled = [...array]; // Create a copy to avoid mutating the original array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };


    useEffect(() => {
        if (autoSubmit && isTestActive) {
            handleSubmitTest();
        }
    }, [autoSubmit, isTestActive]);

    useEffect(() => {
        // Only start the timer if the test is active
        if (isTestActive) {
            startTimer(remainingTime);
        }
    }, [isTestActive]);

    const startTimer = (initialTime) => {
        timerRef.current = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setAutoSubmit(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const handleAnswerChange = (questionId, selectedOption, checked) => {
        setAnswers(prevAnswers => {
            const questionAnswers = prevAnswers[questionId] || [];
            if (checked) {
                return {
                    ...prevAnswers,
                    [questionId]: [...questionAnswers, selectedOption]
                };
            } else {
                return {
                    ...prevAnswers,
                    [questionId]: questionAnswers.filter(option => option !== selectedOption)
                };
            }
        });
    };

    const handleSubmitTest = async () => {
        if (isSubmitting) return; // Prevent submitting if already submitting

        setIsSubmitting(true);
        setLoading(true);

        try {
            const completedDateTime = new Date().toISOString();

            // Calculate marks based on the answers provided by the candidate
            const obtainedMarks = questions.reduce((sum, question) => {
                const selectedOptions = answers[question.cumulative_question_id] || [];
                const correctOptions = question.correct_answers;

                // Check if the selected options match the correct answers
                const isCorrect = correctOptions.length === selectedOptions.length &&
                    correctOptions.every(answer => selectedOptions.includes(answer));

                if (isCorrect) {
                    return sum + question.no_of_marks_allocated;
                }
                return sum;
            }, 0);

            setObtainedMarks(obtainedMarks);
            marksForCertificate = obtainedMarks;

            // Collect the selected answers for the certificate generation
            const questionAnsData = {};
            questions.forEach(question => {
                const selectedOptions = answers[question.cumulative_question_id] || [];
                questionAnsData[question.cumulative_question_id] = selectedOptions;
            });

            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token provided.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Save test results with obtained marks
            const response = await axios.post(`${baseURL}/api/placement-test/test/test-results/save`, {
                placement_test_id: test_id,
                marks_obtained: obtainedMarks,
                total_marks: totalMarks
            }, config);

            // If the timer is active, stop it
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            toast.success('Submitted successfully!');
            setTestResults({
                ...response.data,
                question_ans_data: questionAnsData,
            });
            setIsMonitored(false);
            setIsCameraOn(false);
            setShowSummary(true);

            // If the certificate is to be generated
            if (isIssueCertificate) {
                generateCertificate();
            }

            // Display a message if the result is not yet available
            if (!showResult) {
                alert('Your result will be updated soon.');
            }

            // Clear the timer after test submission
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

        } catch (error) {
            if (error.response) {
                if (error.response && error.response.data.code === 'DUPLICATE_RESULT') {
                    toast.error('Cannot Submit Answers Again: You have already attended this test');
                } else {
                    toast.error('Error');
                }
            }
            console.error('Error saving test results:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAnsweredQuestionsCount = () => {
        return questions.filter(question => answers[question.cumulative_question_id] && answers[question.cumulative_question_id].length > 0).length;
    };

    const getUnansweredQuestionsCount = () => {
        return questions.filter(question => !answers[question.cumulative_question_id] || answers[question.cumulative_question_id].length === 0).length;
    };

    const getWrongAnswersCount = () => {
        return questions.filter(question => {
            const selectedOptions = answers[question.cumulative_question_id] || [];
            const correctOptions = question.correct_answers;

            // Check if the selected options match the correct answers
            return !(correctOptions.length === selectedOptions.length &&
                correctOptions.every(answer => selectedOptions.includes(answer)));
        }).length;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {isEmailVerified ? (<>
                {isTestActive ? (
                    <>
                        <div className="mt-5  mx-2 ">
                            {/* Camera monitoring */}
                            <div className=' -z-50'>
                                {isMonitored && (
                                    <OnlineTestMonitoring
                                        isCameraOn={isMonitored}
                                        style={{ marginLeft: '90%', position: 'fixed', borderRadius: '100%', width: '80px', height: '80px', top: '0' }}
                                        className='fixed pointer-events-none'
                                    />
                                )}
                            </div>
                            <h2 className='text-3xl text-white text-center'>
                                {testDetails ? (
                                    <>{testDetails.test_title}</>
                                ) : (
                                    <>Test</>
                                )}
                            </h2>

                            {/* Total Marks and Timer */}
                            <div className="flex justify-between mb-4 text-white">
                                <div style={{ marginLeft: '85%', }} className='z-50'>Total Marks: {totalMarks}</div>
                                <div className="font-bold fixed text-yellow-400 z-50 bg-red-600 p-2 rounded-md top-0" >
                                    Time Remaining: {Math.floor(remainingTime / 60)}:
                                    {String(remainingTime % 60).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Questions and options */}
                            {!showSummary && !testResults && (
                                <>
                                    {questions.map((question, index) => (
                                        <div key={question.cumulative_question_id} className="mb-4 p-3 rounded-lg shadow-md border text-white">
                                            <div className="relative">
                                                <pre className="max-w-full whitespace-pre-wrap text-base font-normal mb-2">
                                                    <code>
                                                        {index + 1}. <br />{question.question_description}
                                                    </code>
                                                </pre>
                                                <span
                                                    className="absolute top-0 right-0 bg-gray-500 px-2 py-1 rounded text-sm font-semibold"
                                                >
                                                    Marks: {question.no_of_marks_allocated}
                                                </span>
                                            </div>
                                            <div>
                                                {question.options.map((option, idx) => (
                                                    <div key={idx} className="mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`question-${index}-${idx}`}
                                                            value={option.option_description}
                                                            checked={answers[question.cumulative_question_id]?.includes(option.option_description)}
                                                            onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value, e.target.checked)}
                                                            className="mr-2 leading-5"
                                                        />
                                                        <label htmlFor={`question-${index}-${idx}`} className="text-sm">{option.option_description}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Summary and detailed results */}
                            {showSummary && showResult && (
                                <div className="mt-5 shadow-lg bg-white rounded-lg">
                                    <div className="px-6 py-4 border-b">
                                        <h3 className="text-3xl text-center font-semibold">Detailed Results</h3>
                                    </div>
                                    <div className="p-4 bg-light ">
                                        <div className="overflow-x-auto my-4">
                                            <table className="min-w-full table-auto border-collapse mx-auto shadow-lg p-4 bg-white rounded-lg">
                                                <tbody>
                                                    <tr className="border-b">
                                                        <td className="font-bold text-xl sm:text-2xl text-blue-600 px-4 py-3">Total Questions</td>
                                                        <td className="font-bold text-xl sm:text-2xl text-blue-600 px-4 py-3">{questions.length}</td>
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="font-bold text-xl sm:text-2xl text-green-600 px-4 py-3">Answered Questions</td>
                                                        <td className="font-bold text-xl sm:text-2xl text-green-600 px-4 py-3">{getAnsweredQuestionsCount()}</td>
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="font-bold text-xl sm:text-2xl text-yellow-600 px-4 py-3">Unanswered Questions</td>
                                                        <td className="font-bold text-xl sm:text-2xl text-yellow-600 px-4 py-3">{getUnansweredQuestionsCount()}</td>
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="font-bold text-xl sm:text-2xl text-red-600 px-4 py-3">Wrong Answers</td>
                                                        <td className="font-bold text-xl sm:text-2xl text-red-600 px-4 py-3">{getWrongAnswersCount()}</td>
                                                    </tr>
                                                    <tr className="border-b bg-yellow-400">
                                                        <td className="font-bold text-xl sm:text-2xl text-indigo-600 px-4 py-3">Marks Obtained</td>
                                                        <td className="font-bold text-xl sm:text-2xl text-indigo-600 px-4 py-3">{obtainedMarks}</td>
                                                    </tr>
                                                    <tr className="border-b">
                                                        <td className="font-bold text-xl sm:text-2xl text-gray-700 px-4 py-3">Total Marks</td>
                                                        <td className="font-bold text-xl sm:text-2xl text-gray-600 px-4 py-3">{totalMarks}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <div className="text-center my-3">
                                        To view your previously attended test results
                                        <a href="/external-test-results" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                                            Click Here
                                        </a>
                                    </div> */}
                                        <div className="text-center">
                                            <Link
                                                to="/common-dashboard"
                                                className="bg-blue-500 text-white py-2 px-4 rounded-full inline-block text-center cursor-pointer"
                                            >
                                                Goto Dashboard
                                            </Link>
                                            <Link
                                            to="/candidate/companies/show"
                                            className="bg-blue-500 text-white ms-3 py-2 px-4 rounded-full inline-block text-center cursor-pointer"
                                        >
                                            Companies near you
                                        </Link>
                                        </div>

                                        <div className="text-center">
                                            {pdfUrl && (
                                                <a href={pdfUrl} download={`${formData.name}_Lara_Technologies_Certificate.pdf`} className="bg-green-500 text-white py-2 px-4 rounded-full mt-3">
                                                    Download Certificate
                                                </a>
                                            )}
                                        </div>

                                        {/* Detailed results for each question */}
                                        <table className="min-w-full table-auto mt-4 border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 px-4 border-b">#</th>
                                                    <th className="py-2 px-4 border-b">Question</th>
                                                    <th className="py-2 px-4 border-b">Available Options</th>
                                                    <th className="py-2 px-4 border-b">Your Answers</th>
                                                    <th className="py-2 px-4 border-b">Correct Answers</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {questions.map((question, index) => (
                                                    <tr key={question.cumulative_question_id} className="border-b">
                                                        <td className="py-2 px-4">{index + 1}</td>
                                                        <td className="py-2 px-4">
                                                            <pre className="text-dark max-w-xs whitespace-pre-wrap font-normal mb-2 text-sm">
                                                                <code>
                                                                    {index + 1}. <br />{question.question_description}
                                                                </code>
                                                            </pre>
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <div className="space-y-2">
                                                                {question.options.map((option, idx) => (
                                                                    <div key={idx} className="p-2 border rounded">
                                                                        {option.option_description}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {answers[question.cumulative_question_id]?.length > 0
                                                                ? answers[question.cumulative_question_id].map((answer, idx) => (
                                                                    <div key={idx} className={`p-2 rounded ${question.correct_answers.includes(answer) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                                        {answer}
                                                                    </div>
                                                                ))
                                                                : <div className="p-2 rounded bg-gray-500 text-white my-1">Not Attended</div>
                                                            }
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            {question.correct_answers.map((correctAnswer, idx) => (
                                                                <div key={idx} className="p-2 rounded bg-green-500 text-white my-1">
                                                                    {correctAnswer}
                                                                </div>
                                                            ))}
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-center my-3 mb-4">
                                        <Link
                                            to="/common-dashboard"
                                            className="bg-blue-500 text-white py-2 px-4 rounded-full inline-block text-center cursor-pointer"
                                        >
                                            Goto Dashboard
                                        </Link>
                                        <Link
                                            to="/candidate/companies/show"
                                            className="bg-blue-500 text-white py-2 px-4 rounded-full inline-block text-center cursor-pointer"
                                        >
                                            Companies near you
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Message if results are not available */}
                            {showSummary && !showResult && (
                                <h3 className="text-info text-center">Your result will be updated soon.</h3>
                            )}

                            {/* Submit button */}
                            {!showSummary && (
                                <button onClick={handleSubmitTest} className="bg-green-500 text-white py-2 px-4 rounded-full">
                                    Submit Test
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <InActiveTest />
                )}
            </>) : (
                <EmailForm />
            )}
        </>

    );
};

export default PlacementTest;