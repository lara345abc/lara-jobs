// import React, { useState } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { updateCandidateBasicDetails } from '../../../api/candidate';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const UpdateCandidateForm = () => {
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate();

//     // Validation schema using Yup
//     const validationSchema = Yup.object({
//         name: Yup.string()
//             .min(2, 'Name must be at least 2 characters')
//             .max(50, 'Name cannot be more than 50 characters')
//             .required('Name is required'),
//         pin_code: Yup.string()
//             .matches(/^\d{6}$/, 'Pin code must be a 6-digit number')
//             .required('Pin code is required'),
//     });

//     // Function to handle the form submission
//     const handleSubmit = async (values) => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             setErrorMessage('Authorization token is missing.');
//             return;
//         }

//         try {
//             const response = await updateCandidateBasicDetails(values);
//             toast.success('Updated your details')
//             setSuccessMessage('Details updated successfully!');
//             navigate('/signin');
//             setErrorMessage('');
//         } catch (error) {
//             toast.error('Failed to update your details. Pleas try again after some time.')
//             setErrorMessage('Failed to update details. Please try again.');
//             setSuccessMessage('');
//         }
//     };

//     return (
//         <div className="flex justify-center items-center h-screen">
//             <div className="w-full max-w-md p-6 border rounded-lg shadow-md bg-white">
//                 <h2 className="text-2xl font-semibold text-center mb-6">Update Your Details</h2>

//                 {errorMessage && (
//                     <div className="bg-red-100 text-red-600 p-4 mb-4 rounded">
//                         {errorMessage}
//                     </div>
//                 )}

//                 {successMessage && (
//                     <div className="bg-green-100 text-green-600 p-4 mb-4 rounded">
//                         {successMessage}
//                     </div>
//                 )}

//                 <Formik
//                     initialValues={{
//                         name: '',
//                         pin_code: '',
//                     }}
//                     validationSchema={validationSchema}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ values, handleChange }) => (
//                         <Form>
//                             <div className="mb-4">
//                                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                                     Name
//                                 </label>
//                                 <Field
//                                     type="text"
//                                     id="name"
//                                     name="name"
//                                     value={values.name}
//                                     onChange={handleChange}
//                                     className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Enter your name"
//                                 />
//                                 <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
//                             </div>

//                             <div className="mb-4">
//                                 <label htmlFor="pin_code" className="block text-sm font-medium text-gray-700">
//                                     Pin Code
//                                 </label>
//                                 <Field
//                                     type="text"
//                                     id="pin_code"
//                                     name="pin_code"
//                                     value={values.pin_code}
//                                     onChange={handleChange}
//                                     className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     placeholder="Enter your pin code"
//                                 />
//                                 <ErrorMessage name="pin_code" component="div" className="text-red-500 text-sm mt-1" />
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//                             >
//                                 Update Details
//                             </button>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//         </div>
//     );
// };

// export default UpdateCandidateForm;



import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateCandidateBasicDetails } from '../../../api/candidate';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateCandidateForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationDetails, setLocationDetails] = useState({
        town: '',
        district: '',
        state: '',
    });
    const navigate = useNavigate();

    // Validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name cannot be more than 50 characters')
            .required('Name is required'),
        pin_code: Yup.string()
            .matches(/^\d{6}$/, 'Pin code must be a 6-digit number')
            .required('Pin code is required'),
        town: Yup.string().required('Town is required'),
        district: Yup.string().required('District is required'),
        state: Yup.string().required('State is required'),
    });

    // Function to fetch location details from the pin code API
    const fetchLocationDetails = async (pin_code) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pin_code}`);
            console.log('Fetched Details:', response);
            if (response.data && response.data[0] && response.data[0].PostOffice && response.data[0].PostOffice.length > 0) {
                const { District, State } = response.data[0].PostOffice[0];
                setLocationDetails({
                    town: '', // Keep the town empty for user input
                    district: District,
                    state: State,
                });
            } else {
                toast.error('No location details found for this pin code.');
                setLocationDetails({ town: '', district: '', state: '' });
            }
        } catch (error) {
            console.error('Error fetching pin code details:', error);
            toast.error('Failed to fetch location details. Please check the pin code.');
            setLocationDetails({ town: '', district: '', state: '' });
        } finally {
            setLoading(false);
        }
    };

    // Function to handle the form submission
    const handleSubmit = async (values) => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        // if (!token) {
        //     setErrorMessage('Authorization token is missing.');
        //     return;
        // }

        if (!email) {
            setErrorMessage('Email is missing.');
            return;
        }

        const updatedValues = {
            ...values,
            email,
        };

        try {
            const response = await updateCandidateBasicDetails(updatedValues);
            toast.success('Updated your details');
            setSuccessMessage('Details updated successfully!');
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            localStorage.removeItem('candidate_id');

            navigate('/signin');
            setErrorMessage('');
        } catch (error) {
            toast.error('Failed to update your details. Please try again after some time.');
            setErrorMessage('Failed to update details. Please try again.');
            setSuccessMessage('');
        }
    };


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-6 border rounded-lg shadow-md bg-white">
                <h2 className="text-2xl font-semibold text-center mb-6">Please Fill this</h2>

                {errorMessage && (
                    <div className="bg-red-100 text-red-600 p-4 mb-4 rounded">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 text-green-600 p-4 mb-4 rounded">
                        {successMessage}
                    </div>
                )}

                <Formik
                    initialValues={{
                        name: '',
                        pin_code: '',
                        town: locationDetails.town,
                        district: locationDetails.district,
                        state: locationDetails.state,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, setFieldValue, setFieldTouched }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your name"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="pin_code" className="block text-sm font-medium text-gray-700">
                                    Pin Code
                                </label>
                                <Field
                                    type="text"
                                    id="pin_code"
                                    name="pin_code"
                                    value={values.pin_code}
                                    onChange={(e) => {
                                        handleChange(e);
                                        const { value } = e.target;
                                        if (value.length === 6) {
                                            fetchLocationDetails(value); // Fetch location data when 6 digits are entered
                                        }
                                    }}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your pin code"
                                />
                                <ErrorMessage name="pin_code" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="town" className="block text-sm font-medium text-gray-700">
                                    Town
                                </label>
                                <Field
                                    type="text"
                                    id="town"
                                    name="town"
                                    value={values.town}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Town"
                                />
                                <ErrorMessage name="town" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                                    District
                                </label>
                                <Field
                                    type="text"
                                    id="district"
                                    name="district"
                                    value={values.district || locationDetails.district}
                                    onChange={handleChange}
                                    onBlur={() => setFieldTouched('district', true)}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="District"
                                />
                                <ErrorMessage name="district" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                    State
                                </label>
                                <Field
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={values.state || locationDetails.state}
                                    onChange={handleChange}
                                    onBlur={() => setFieldTouched('state', true)}
                                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="State"
                                />
                                <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Update Details
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UpdateCandidateForm;
