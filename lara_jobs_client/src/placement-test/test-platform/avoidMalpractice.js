    //code to prevent open new tab and opening the context menu 
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!showSummary && document.hidden) {
                setIsCameraOn(false);
                setIsMonitored(false);
                setAutoSubmit(true);
                await handleSubmitTest();
                navigate('/malpractice-detected');
            }
        };

        const handlePopState = async () => {
            if (!showSummary) {
                setAutoSubmit(true);
                await handleSubmitTest();
                navigate('/malpractice-detected');
            }
        };

        const setupListeners = () => {
            document.addEventListener("visibilitychange", handleVisibilityChange);
            window.addEventListener("popstate", handlePopState);
        };

        const cleanupListeners = () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("popstate", handlePopState);
        };

        setupListeners();

        return () => {
            cleanupListeners();
        };
    }, [navigate, showSummary]);

    useEffect(() => {
        const disableRightClick = (event) => {
            event.preventDefault();
        };

        const disableDevTools = (event) => {
            // Block F12
            if (event.key === "F12") {
                event.preventDefault();
            }
            // Block Ctrl + Shift + I
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "I") {
                event.preventDefault();
            }
        };

        const disableSelection = (event) => {
            event.preventDefault();
        };

        const disableCopy = (event) => {
            event.preventDefault();
        };

        const setupListeners = () => {
            document.addEventListener("contextmenu", disableRightClick); // Disable right-click
            document.addEventListener("keydown", disableDevTools); // Block dev tools
            document.addEventListener("selectstart", disableSelection); // Disable text selection
            document.addEventListener("copy", disableCopy); // Disable copying
        };

        const cleanupListeners = () => {
            document.removeEventListener("contextmenu", disableRightClick);
            document.removeEventListener("keydown", disableDevTools);
            document.removeEventListener("selectstart", disableSelection);
            document.removeEventListener("copy", disableCopy);
        };

        setupListeners();

        return () => {
            cleanupListeners();
        };
    }, []);
    // code to prevent open new tab and opening the context menu ends 















    let marksForCertificate;


    const generateCertificate = () => {
        const doc = new jsPDF("landscape"); // Set landscape layout
        const presentDate = new Date().toLocaleString();
        const imgWidth = 40;
        const imgHeight = 40;

        // Validate formData
        if (!formData || !formData.name) {
            alert("Missing required data. Please ensure all fields are filled.");
            return;
        }

        // Draw Background Curves
        doc.setFillColor(76, 149, 228); // Blue color
        doc.rect(0, 0, 297, 210, "F"); // Cover full page
        doc.setFillColor(255, 173, 63); // Orange color
        doc.circle(297, 105, 150, "F"); // Orange curve on the right

        // Load Logo
        const loadImage = new Promise((resolve, reject) => {
            const image = new Image();
            image.src = logoUrl;
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to load logo image."));
        });

        // Load QR Code Image
        const loadQRCode = new Promise((resolve, reject) => {
            const qrCode = new Image();
            qrCode.src = qrCodeUrl;  // Provide the URL for the QR code image
            qrCode.onload = () => resolve(qrCode);
            qrCode.onerror = () => reject(new Error("Failed to load QR code image."));
        });

        Promise.all([loadImage, loadQRCode])
            .then(([logoImage, qrCodeImage]) => {
                // Add Logo
                doc.addImage(logoImage, "PNG", 20, 15, imgWidth, imgHeight);

                const pageWidth = doc.internal.pageSize.getWidth();
                const centerX = pageWidth / 2;

                // Header Details
                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(255); // White text for header
                doc.text("LARA TECHNOLOGIES", 80, 25);
                doc.setFont("times", "normal");
                doc.setFontSize(12);
                doc.setTextColor(40, 40, 40); // Dark gray text for address and contact
                doc.text(
                    "8, 100 Feet Ring Road, 2nd Stage, BTM Layout, Bengaluru, Karnataka 560076",
                    80,
                    32
                );
                doc.text("+91 79759 38871 | ramesh@lara.co.in", 80, 39);

                // Certificate Title
                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(255); // White text for certificate title
                doc.text(
                    "CERTIFICATE OF RECOGNITION",
                    centerX,
                    60,
                    null,
                    null,
                    "center"
                );

                doc.setFont("times", "italic");
                doc.setFontSize(18); // Slightly smaller font for additional line
                doc.setTextColor(255); // White text

                // Fallback to "Logical Reasoning" if certificate_name is not available
                const certificateName = testDetails.certificate_name || "Logical Reasoning";

                doc.text(
                    `in ${certificateName}`,
                    centerX,
                    70, // Adjusted Y position to be below the title
                    null,
                    null,
                    "center"
                );


                // Recipient Details
                doc.setFont("times", "italic");
                doc.setFontSize(26);
                doc.setTextColor(255); // White text for recipient section
                doc.text(
                    "This certificate is hereby bestowed upon",
                    centerX,
                    80,
                    null,
                    null,
                    "center"
                );

                doc.setFont("times", "bold");
                doc.setFontSize(28);
                doc.setTextColor(0, 0, 0); // Black text for the recipient's name
                doc.text(formData.name, centerX, 95, null, null, "center");

                // Marks
                doc.setFont("times", "normal");
                doc.setFontSize(16);
                doc.text(
                    `Marks Obtained: ${marksForCertificate} out of ${totalMarks}`,
                    148.5,
                    105,
                    null,
                    null,
                    "center"
                );

                // Description
                doc.setFont("times", "normal");
                doc.setFontSize(14);
                doc.setTextColor(40, 40, 40); // Dark gray text for description
                doc.text(
                    "For successfully completing the Test conducted by Lara Technologies.",
                    centerX,
                    112,
                    null,
                    null,
                    "center"
                );

                // Table Content
                const tableStartY = 125; // Start position for the table
                const columnSpacing = 70;
                const rowSpacing = 8;
                const tableData = [
                    { label: "Email:", value: formData.email },
                    { label: "College Name:", value: formData.college_name },
                    { label: "University Name:", value: formData.university_name },
                ];

                doc.setFontSize(14);
                doc.setFont("times", "bold")
                tableData.forEach((row, index) => {
                    let yPos = tableStartY + index * rowSpacing;
                    if (yPos > 180) {
                        doc.addPage();
                        yPos = 20; // Reset position for new page
                    }
                    doc.setTextColor(40, 40, 40); // Dark gray text for table labels and values
                    doc.text(row.label, 80, yPos); // Label column
                    const wrappedValue = doc.splitTextToSize(row.value || "N/A", 100);
                    doc.text(wrappedValue, 80 + columnSpacing, yPos); // Value column
                });

                // Footer
                doc.setFont("times", "italic");
                doc.setFontSize(10);
                doc.setTextColor(200, 200, 200); // Light gray text for footer
                doc.text(
                    "Certificate generated on " + presentDate,
                    centerX,
                    190,
                    null,
                    null,
                    "center"
                );

                // QR Code and Message
                const qrCodeX = 10; // X position for QR code (left bottom corner)
                const qrCodeY = 150; // Y position for QR code
                const qrCodeWidth = 40; // Width of QR code
                const qrCodeHeight = 40; // Height of QR code
                doc.addImage(qrCodeImage, "PNG", qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                // Message below QR Code
                doc.setFont("times", "italic");
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0); // Black text for message
                doc.text("Join our whatsApp channel for more updates", qrCodeX + 0, qrCodeY + 45);

                // // Save Certificate
                // doc.save(`${formData.name}_Lara_Technologies_Certificate.pdf`);

                // const pdfBlob = doc.output("blob"); // Generate PDF as a Blob

                const pdfBlob = doc.output("blob");
                const pdfObjectUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfObjectUrl);
                sendPdfToEmail(pdfBlob);
            })
            .catch((err) => {
                console.error(err.message);
                alert("Unable to load the logo or QR code. Please check the URLs.");
            });
    };











    
    const sendPdfToEmail = async (pdfBlob) => {
        const { name, email } = formData;

        if (!name || !email) {
            alert("Name and email are required.");
            return;
        }

        const formPayload = new FormData();
        formPayload.append("pdf", pdfBlob, `${name}_Certificate.pdf`);
        formPayload.append("email", email);
        formPayload.append("name", name);

        try {
            const response = await axios.post(
                `${baseURL}/api/placement-test/send-certificate-to-email`,
                formPayload,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200) {
                toast.success("The certificate has been sent to your registered email")
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            // alert("Failed to send the certificate.");
            toast.error("Sorry!! We are Unable to send the certificate to you email!")
        }
    };




   