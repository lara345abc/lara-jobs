import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logoUrl from "./laralogo.png";
import qrCodeUrl from "./qr_code_whatsApp.png";
import { baseURL } from "../../config/baseURL";
import Loading from "../../components/loading/Loading";

const CandidateTestResults = ({ email }) => {
    const [studentData, setStudentData] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [testDetails, setTestDetails] = useState({});
    const [pdfUrl, setPdfUrl] = useState(null);
    const [sendingEmail, setSendingEmail] = useState({});

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
                const response = await axios.get(`${baseURL}/api/placement-test/test/test-results/getResultsByCandidateId`, config);
                const { student, testResults } = response.data;
                setStudentData(student);
                setTestResults(testResults);
                setTestDetails(testResults[0]?.PlacementTest || {});
                setLoading(false);
            } catch (err) {
                // setError(err.response?.data?.message || "An error occurred while fetching data.");
                setError("Your test results will be displayed here.");
                setLoading(false);
            }
        };

        fetchResults();
    }, [email]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <div className="mt-4 mx-auto max-w-4xl">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-300">
                    {error}
                </div>
            </div>

        );
    }

    const sendPdfToEmail = async (pdfBlob, formData) => {
        const { name, email } = formData;
        if (!formData.student_name || !formData.email) {
            alert("Name and email are required.");
            return;
        }

        const formPayload = new FormData();
        formPayload.append("pdf", pdfBlob, `${formData.name}_Certificate.pdf`);
        formPayload.append("email", formData.email);
        formPayload.append("name", formData.name);

        try {
            setSendingEmail(prevState => ({ ...prevState, [formData.testIndex]: true })); // Set loading state for this test
            const response = await axios.post(
                `${baseURL}/api/placement-test/send-certificate-to-email`,
                formPayload,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setSendingEmail(prevState => ({ ...prevState, [formData.testIndex]: false })); // Reset loading state after completion
            if (response.status === 200) {
                toast.success("The certificate has been sent to your registered email");
            }
        } catch (error) {
            setSendingEmail(prevState => ({ ...prevState, [formData.testIndex]: false })); // Reset loading state after failure
            console.error("Error:", error.response?.data || error.message);
            toast.warning("Sorry!! We are unable to send the certificate to your email!");
        }
    };

    const generateCertificate = (formData, testResults, index, result) => {
        console.log('formdata ', formData)
        const doc = new jsPDF("landscape");
        const presentDate = new Date().toLocaleString();
        const imgWidth = 40;
        const imgHeight = 40;

        if (!formData || !formData.name) {
            alert("Missing required data. Please ensure all fields are filled.");
            return;
        }

        doc.setFillColor(76, 149, 228);
        doc.rect(0, 0, 297, 210, "F");
        doc.setFillColor(255, 173, 63);
        doc.circle(297, 105, 150, "F");

        const loadImage = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = logoUrl; // Replace logoUrl with the actual logo URL
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to load logo image."));
        });

        const loadQRCode = new Promise((resolve, reject) => {
            const qrCode = new Image();
            qrCode.src = qrCodeUrl; // Replace qrCodeUrl with the actual QR code URL
            qrCode.onload = () => resolve(qrCode);
            qrCode.onerror = () => reject(new Error("Failed to load QR code image."));
        });

        Promise.all([loadImage, loadQRCode])
            .then(([logoImage, qrCodeImage]) => {
                doc.addImage(logoImage, "PNG", 20, 15, imgWidth, imgHeight);
                const pageWidth = doc.internal.pageSize.getWidth();
                const centerX = pageWidth / 2;

                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(255);
                doc.text("LARA TECHNOLOGIES", 80, 25);

                doc.setFont("times", "normal");
                doc.setFontSize(12);
                doc.setTextColor(40, 40, 40);
                doc.text("8, 100 Feet Ring Road, 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076", 80, 32);
                doc.text("+91 79759 38871 | ramesh@lara.co.in", 80, 39);

                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(255);
                doc.text("CERTIFICATE OF RECOGNITION", centerX, 60, null, null, "center");

                doc.setFont("times", "italic");
                doc.setFontSize(18);
                doc.setTextColor(255);

                const certificateName = testResults[index].Placementtests.certificate_name || "Logical Reasoning";
                doc.text(`in ${certificateName}`, centerX, 70, null, null, "center");

                doc.setFont("times", "italic");
                doc.setFontSize(26);
                doc.setTextColor(255);
                doc.text("This certificate is hereby bestowed upon", centerX, 80, null, null, "center");

                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(0, 0, 0);
                doc.text(formData.name, centerX, 95, null, null, "center");

                doc.setFont("times", "normal");
                doc.setFontSize(16);
                doc.text(`Marks Obtained: ${result.marks_obtained} out of ${result.total_marks}`, 148.5, 105, null, null, "center");

                doc.setFont("times", "normal");
                doc.setFontSize(14);
                doc.setTextColor(40, 40, 40);
                doc.text("For successfully completing the Test conducted by Lara Technologies.", centerX, 112, null, null, "center");

                const tableStartY = 125;
                const columnSpacing = 70;
                const rowSpacing = 8;
                const tableData = [
                    { label: "Email:", value: formData.email },
                    // { label: "College Name:", value: formData.college_name },
                    // { label: "University Name:", value: formData.university_name },
                ];

                doc.setFontSize(14);
                doc.setFont("times", "bold");
                tableData.forEach((row, index) => {
                    let yPos = tableStartY + index * rowSpacing;
                    if (yPos > 180) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.setTextColor(40, 40, 40);
                    doc.text(row.label, 80, yPos);
                    const wrappedValue = doc.splitTextToSize(row.value || "N/A", 100);
                    doc.text(wrappedValue, 80 + columnSpacing, yPos);
                });

                doc.setFont("times", "italic");
                doc.setFontSize(10);
                doc.setTextColor(200, 200, 200);
                doc.text("Certificate generated on " + presentDate, centerX, 190, null, null, "center");

                const qrCodeX = 10;
                const qrCodeY = 150;
                const qrCodeWidth = 40;
                const qrCodeHeight = 40;
                doc.addImage(qrCodeImage, "PNG", qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                doc.setFont("times", "italic");
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text("Join our whatsApp channel for more updates", qrCodeX + 0, qrCodeY + 45);

                // Download the PDF
                doc.save(`${formData.name}_Certificate.pdf`);
            })
            .catch((err) => {
                console.error(err.message);
                alert("Unable to load the logo or QR code. Please check the URLs.");
            });
    };


    return (
        <div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mx-auto">
                    <div className="shadow-sm border rounded-lg">
                        <div className="p-4">
                            <h2 className="text-center text-xl font-semibold mb-3">Student Details</h2>
                            <p>
                                <strong>Name:</strong> {studentData.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {studentData.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="mt-2">
                <h3 className="text-center text-2xl font-semibold mb-4">Test Results</h3>
                {testResults.length > 0 ? (
                    <table className="min-w-full table-auto border-separate border-spacing-0">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-4 py-2 border-b">#</th>
                                <th className="px-4 py-2 border-b">Test Title</th>
                                <th className="px-4 py-2 border-b">Total Marks</th>
                                <th className="px-4 py-2 border-b">Marks Obtained</th>
                                <th className="px-4 py-2 border-b">Date</th>
                                <th className="px-4 py-2 border-b">Certificate</th>
                            </tr>
                        </thead>
                        <tbody className="text-black text-center">
                            {testResults.map((result, index) => (
                                <tr key={index} className="odd:bg-gray-100">
                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 border-b">{result.Placementtests.test_title}</td>
                                    <td className="px-4 py-2 border-b">{result.total_marks}</td>
                                    <td className="px-4 py-2 border-b">{result.marks_obtained}</td>
                                    <td className="px-4 py-2 border-b">{new Date(result.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => generateCertificate(studentData, testResults, index, result)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                        >
                                            {sendingEmail[index] ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0 8 8 0 1 1-16 0z"></path>
                                                    </svg>
                                                    Generating...
                                                </>
                                            ) : (
                                                "Download Certificate"
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-lg text-blue-500 mt-4">
                        No test results available.
                    </div>
                )}
            </div>
            <div className="mt-4">
            </div>
        </div>

    );
};

export default CandidateTestResults;
