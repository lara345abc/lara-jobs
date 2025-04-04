// import { useState } from "react";
// import { Formik, Field, Form } from "formik";
// import { sendPhoneOtp } from "../../api/auth";
// import toast from "react-hot-toast";

// const PhoneForm = ({ onPhoneVerified, email }) => {
//   const [phone, setPhone] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const handleSubmitPhone = async (values, { resetForm }) => {
//     try {
//       await sendPhoneOtp(email, values.phone);
//       setOtpSent(true);
//       setPhone(values.phone);
//       resetForm();
//     } catch (error) {
//       if (error.response && error.response.data.code === 'EMAIL_ALREADY_EXISTS') {
//        toast.error('Phone number is alredy registered.')
//       }else{
//         console.error("Error sending OTP", error);
//       }
//     }
//   };

//   const handleVerifyPhoneOtp = async (values) => {
//     try {
//       // Simulating OTP verification
//       if (values.otp === "123456") {
//         setOtpVerified(true);
//         onPhoneVerified();
//       }
//     } catch (error) {
//       console.error("Error verifying OTP", error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-sm p-6 border rounded-lg">
//         {/* Phone Number Form */}
//         {!otpSent ? (
//           <Formik
//             initialValues={{ phone: "" }}
//             onSubmit={handleSubmitPhone}
//           >
//             <Form>
//               <div className="mb-4">
//                 <Field
//                   type="text"
//                   name="phone"
//                   placeholder="Enter your phone number"
//                   className="w-full px-4 py-2 border rounded-md"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 rounded-md"
//               >
//                 Send OTP
//               </button>
//             </Form>
//           </Formik>
//         ) : !otpVerified ? (
//           // OTP Verification Form
//           <Formik
//             initialValues={{ otp: "" }}
//             onSubmit={handleVerifyPhoneOtp}
//           >
//             <Form>
//               <div className="mb-4">
//                 <Field
//                   type="text"
//                   name="otp"
//                   placeholder="Enter OTP"
//                   className="w-full px-4 py-2 border rounded-md"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white py-2 rounded-md"
//               >
//                 Verify OTP
//               </button>
//             </Form>
//           </Formik>
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default PhoneForm;


import { useState } from "react";
import { Formik, Field, Form } from "formik";
import toast from "react-hot-toast";
import { savePhoneNumber } from "../../api/auth";

const PhoneForm = ({ onPhoneVerified, email }) => {
  const [phone, setPhone] = useState("");
  const [phoneSaved, setPhoneSaved] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const handleSubmitPhone = async (values, { resetForm }) => {
    try {
      setLoading(true);
      await savePhoneNumber(email, values.phone); 
      setPhoneSaved(true);
      setPhone(values.phone);
      resetForm();
      onPhoneVerified(); 
      toast.success('Phone number added successfully.');
    } catch (error) {
      console.error("Error saving phone number", error);
      if (error.response && error.response.data.code === 'PHONE_ALREADY_EXISTS') {
        toast.error('Phone number is already registered.');
      } else {
        toast.error('Error saving phone number. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 border rounded-lg">
        <p className="text-slate-950">Pleas provide a valid phone Number this will be used for future communication</p>
        {/* Phone Number Form */}
        {!phoneSaved ? (
          <Formik
            initialValues={{ phone: "" }}
            onSubmit={handleSubmitPhone}
          >
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </Form>
          </Formik>
        ) : null}
      </div>
    </div>
  );
};

export default PhoneForm;
