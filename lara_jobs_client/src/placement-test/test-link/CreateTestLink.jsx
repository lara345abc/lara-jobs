import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config/baseURL';
import toast from 'react-hot-toast';

const CreateTestLink = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [numQuestions, setNumQuestions] = useState(20);
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectAllTopics, setSelectAllTopics] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [showResult, setShowResult] = useState(true);
    const [isMonitored, setIsMonitored] = useState(false); // State for isMonitored
    const [isIssueCertificate, setIsIssueCertificate] = useState(false); // State for provide certificate
    const [newTestLink, setNewTestLink] = useState(''); // New state for test link
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' }); // State for Bootstrap alerts
    const [testTitle, setTestTitle] = useState('');
    const [channelLink, setChannelLink] = useState('');
    const [certificateName, setCertificateName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
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

                const response = await axios.get(`${baseURL}/api/placement-test/subject/get-all-subjects`, config);
                setSubjects(response.data.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleChannelSelect = (link) => {
        setChannelLink(link);
    };

    const handleSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setSelectedTopics([]);
        setAvailableQuestions(0);
        setErrorMessage('');

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

            const response = await axios.get(`${baseURL}/api/placement-test/topic/topics-by-subject/${subjectId}`, config);
            console.log("topics , ",response.data)
            const topics = response.data.topics;
            setTopics(topics)
            
            // Fetch question counts for these topics
            const topicIds = topics.map(topic => topic.topic_id);
            // const questionCountsResponse = await axios.post(`${baseURL}/api/placement-test/questions/getQuestionCountsByTopicIds`, {
            //     topic_ids: topicIds
            // }, config);

            // const topicsWithCounts = topics.map(topic => {
            //     const countData = questionCountsResponse.data.find(item => item.topic_id === topic.topic_id);
            //     return {
            //         ...topic,
            //         question_count: countData ? countData.question_count : 0
            //     };
            // });

            // setTopics(topicsWithCounts);
        } catch (error) {
            console.error("Erroro while fetching topics ", error)
            if (error.response && error.response.status === 404) {
                setAlert({ show: true, message: 'No Topics Available for this Subject', variant: 'info' });
            } else {
                setAlert({ show: true, message: 'Something went wrong', variant: 'danger' });
                console.error('Error fetching topics:', error);
            }
        }
    };

    const handleTopicChange = (topicId) => {
        setSelectedTopics((prevSelectedTopics) => {
            const newSelectedTopics = prevSelectedTopics.includes(topicId)
                ? prevSelectedTopics.filter((id) => id !== topicId)
                : [...prevSelectedTopics, topicId];

            updateAvailableQuestions(newSelectedTopics);
            return newSelectedTopics;
        });
    };

    const handleSelectAllTopics = () => {
        setSelectAllTopics(!selectAllTopics);
        if (!selectAllTopics) {
            const allTopicIds = topics.map(topic => topic.topic_id);
            setSelectedTopics(allTopicIds);
            updateAvailableQuestions(allTopicIds);
        } else {
            setSelectedTopics([]);
            setAvailableQuestions(0);
        }
    };

    const updateAvailableQuestions = async (topicIds) => {
        if (topicIds.length === 0) {
            setAvailableQuestions(0);
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

            const response = await axios.post(`${baseURL}/api/placement-test/questions/getQuestionCountsByTopicIds`, {
                topic_ids: topicIds
            }, config);

            const totalAvailableQuestions = response.data.reduce((sum, topic) => sum + topic.question_count, 0);
            setAvailableQuestions(totalAvailableQuestions);
        } catch (error) {
            console.error('Error fetching available questions:', error);
        }
    };

    const handleNumQuestionsChange = (e) => {
        const value = e.target.value;
        setNumQuestions(value);
        if (value > availableQuestions) {
            // setErrorMessage(`Enter less than ${availableQuestions}`);
        } else {
            setErrorMessage('');
        }
    };

    const handleCreateLink = async () => {
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
                `${baseURL}/api/placement-test/test/test-link/create`,
                {
                    number_of_questions: numQuestions,
                    description,
                    start_time: startTime,
                    end_time: endTime,
                    show_result: showResult,
                    topic_ids: selectedTopics,
                    is_Monitored: isMonitored, 
                    test_title: testTitle,
                    certificate_name: certificateName,
                    issue_certificate: isIssueCertificate
                },
                config
            );
            console.log(response.data, "---------------------------");
            // Set the test link in state
            // setNewTestLink(response.data.newTest.test_link);
            setAlert({ show: true, message: 'Link Created Successfully', variant: 'success' });
            toast.success('Test Link Created')

            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error creating test link:', error.response.data);
            setAlert({ show: true, message: 'Something went wrong!!', variant: 'danger' });
            toast.error(`Something went wrong`, error.response.data)
            // Scroll to the top of the page for the error alert
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    return (
        <div className="max-w-4xl mx-auto mt-5 p-4 bg-white shadow-md rounded-lg text-black">
            {/* Alert */}
            {alert.show && (
                <div className={`p-4 mb-4 text-white rounded-md ${alert.variant === "success" ? "bg-green-500" : "bg-red-500"}`}>
                    {alert.message}
                    <button onClick={() => setAlert({ ...alert, show: false })} className="float-right font-bold">X</button>
                </div>
            )}

            {/* Success Message */}
            {newTestLink && (
                <div className="mt-4 p-3 border border-blue-500 rounded-md bg-gray-100">
                    <h5 className="text-lg font-semibold">Link Created Successfully:</h5>
                    <p className="text-blue-500 font-bold">{newTestLink}</p>
                    <p className="font-semibold">
                        To add questions to this link,
                        <Link to="/test-links" className="text-blue-600 underline"> click here</Link>.
                    </p>
                </div>
            )}

            <h3 className="text-center text-xl font-bold mb-4">Create Test Link</h3>

            {/* Select Subject */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Select Subject</label>
                <select className="w-full p-2 border rounded-md bg-gray-100"
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    required>
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select Topics */}
            <div className="mb-4">
                <h5 className="font-medium text-gray-700">Select Topics</h5>
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={selectAllTopics} onChange={handleSelectAllTopics} />
                    Select All Topics
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {topics.map((topic) => (
                        <label key={topic.topic_id} className="flex items-center">
                            <input type="checkbox" className="mr-2" checked={selectedTopics.includes(topic.topic_id)} onChange={() => handleTopicChange(topic.topic_id)} />
                            {topic.name} 
                            {/* ({topic.question_count} questions) */}
                        </label>
                    ))}
                </div>
            </div>

            {/* Test Title */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Test Title</label>
                <input type="text" className="w-full p-2 border rounded-md bg-gray-100"
                    value={testTitle} onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="Enter test title" required />
            </div>

            {/* Certificate Name */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Certificate Name</label>
                <input type="text" className="w-full p-2 border rounded-md bg-gray-100"
                    value={certificateName} onChange={(e) => setCertificateName(e.target.value)}
                    placeholder="Enter certificate name" required />
            </div>

            {/* Number of Questions */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Number of Questions</label>
                <input type="number" className="w-full p-2 border rounded-md bg-gray-100"
                    value={numQuestions} onChange={handleNumQuestionsChange} />
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            </div>

            {/* Test Description */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Test Description</label>
                <textarea className="w-full p-2 border rounded-md bg-gray-100"
                    rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Start Time */}
            <div className="mb-4">
                <label className="inline text-gray-700 font-medium me-2">Start Time</label>
                <input type="datetime-local" className=" p-2 border rounded-md bg-gray-100"
                    value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>

            {/* End Time */}
            <div className="mb-4">
                <label className="inline text-gray-700 font-medium me-4">End Time</label>
                <input type="datetime-local" className=" p-2 border rounded-md bg-gray-100"
                    value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>

            {/* Checkboxes */}
            <div className="mb-4">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2" checked={showResult} onChange={() => setShowResult(!showResult)} />
                    Show Results After Test
                </label>
                <label className="flex items-center mt-2">
                    <input type="checkbox" className="mr-2" checked={isMonitored} onChange={() => setIsMonitored(!isMonitored)} />
                    Enable Monitoring
                </label>
                <label className="flex items-center mt-2">
                    <input type="checkbox" className="mr-2" checked={isIssueCertificate} onChange={() => setIsIssueCertificate(!isIssueCertificate)} />
                    Provide Certificate
                </label>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
                onClick={handleCreateLink}>
                Create Test Link
            </button>
        </div>


    );
};

export default CreateTestLink;
