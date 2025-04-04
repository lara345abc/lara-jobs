// import { Formik, Field, Form, ErrorMessage } from "formik";
// import { useState, useEffect } from "react";
// import { updatePassword } from "../../api/candidate";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
// import { useNavigate } from "react-router-dom";

// const PasswordForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState(null);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isSuccess) {
//       const timeout = setTimeout(() => {
//         setIsSuccess(false);
//       }, 3000);

//       return () => clearTimeout(timeout);
//     }
//   }, [isSuccess]);

//   const handleSubmit = async (values) => {
//     if (values.password !== values.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     setIsLoading(true);
//     setIsError(false);
//     setError(null);

//     try {
//       await updatePassword(values.password);
//       setIsSuccess(true);
//       navigate('/common-dashboard')
//     } catch (err) {
//       setIsError(true);
//       setError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-sm p-6 border rounded-lg">
//         <Formik
//           initialValues={{ password: "", confirmPassword: "" }}
//           onSubmit={handleSubmit}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {/* Password Input */}
//               <div className="mb-4 relative">
//                 <Field
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter password"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={values.password}
//                   onChange={(e) => setFieldValue("password", e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-2 top-2 text-gray-500"
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="w-6 h-6" />
//                   ) : (
//                     <EyeIcon className="w-6 h-6" />
//                   )}
//                 </button>
//                 <div className="text-red-500 text-sm">
//                   <ErrorMessage name="password" />
//                 </div>
//               </div>

//               {/* Confirm Password Input */}
//               <div className="mb-4 relative">
//                 <Field
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   placeholder="Confirm password"
//                   className="w-full px-4 py-2 border rounded-md"
//                   value={values.confirmPassword}
//                   onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-2 top-2 text-gray-500"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeSlashIcon className="w-6 h-6" />
//                   ) : (
//                     <EyeIcon className="w-6 h-6" />
//                   )}
//                 </button>
//                 <div className="text-red-500 text-sm">
//                   <ErrorMessage name="confirmPassword" />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 rounded-md"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Updating..." : "Submit"}
//               </button>

//               {isError && (
//                 <div className="mt-4 text-red-500">
//                   There was an error updating the password: {error.message}
//                 </div>
//               )}

//               {isSuccess && (
//                 <div className="mt-4 text-green-500">
//                   Password updated successfully!
//                 </div>
//               )}
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default PasswordForm;


import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import { updatePassword } from "../../api/candidate";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import UpdateCandidateForm from "../candidate/profileDetails/UpdateCandidateForm";
import toast from "react-hot-toast";

const PasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false); // State to track password update
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
        toast.success('Password updated Successfully ')
        setPasswordUpdated(true); // When password is updated, move to the next step
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      await updatePassword(values.password);
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 border rounded-lg">
        {!passwordUpdated ? (
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* Password Input */}
                <div className="mb-4 relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border rounded-md"
                    value={values.password}
                    onChange={(e) => setFieldValue("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="text-red-500 text-sm">
                    <ErrorMessage name="password" />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4 relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border rounded-md"
                    value={values.confirmPassword}
                    onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="text-red-500 text-sm">
                    <ErrorMessage name="confirmPassword" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Submit"}
                </button>

                {isError && (
                  <div className="mt-4 text-red-500">
                    There was an error updating the password: {error.message}
                  </div>
                )}

                {isSuccess && (
                  <div className="mt-4 text-green-500">
                    Password updated successfully! Please update your details 
                  </div>
                )}
              </Form>
            )}
          </Formik>
        ) : (
          <UpdateCandidateForm /> 
        )}
      </div>
    </div>
  );
};

export default PasswordForm;
