// import { useState } from "react";
// import EmailInput from "./EmailInput";
// import OtpInput from "./OtpInput";
// import ResendOtp from "./ResendOtp";
// import PhoneForm from "./PhoneForm";
// import PasswordForm from "./PasswordForm";
// import { createCandidate } from "../../api/candidate";
// import { resendEmailOtp, verifyOtp } from "../../api/auth";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const EmailForm = ({ onOtpVerified }) => {
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [emailVerified, setEmailVerified] = useState(false);
//   const [phoneVerified, setPhoneVerified] = useState(false); // Add state for phone verification
//   const navigate = useNavigate();

//   const handleSubmitEmail = async (email) => {
//     try {
//       setErrorMessage("");
//       setLoading(true);

//       const response = await createCandidate(email);

//       if (response.status === 201 ) {
//         setEmail(email);
//         setOtpSent(true);
//       }
//     } catch (error) {
//       if (error.response && error.response.data.code === 'EMAIL_ALREADY_EXISTS') {
//         // setErrorMessage("An account with this email ID exists");
//         localStorage.setItem('email', email);
//         toast.error('Account exist with this email. Please Login');
//         navigate('/signin')
//       } else {
//         toast.error('Error sending OTP. Please try again.')
//         setErrorMessage("Error sending OTP. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (otp) => {
//     try {
//       setErrorMessage("");
//       setLoading(true);

//       await verifyOtp(email, otp);
//       setOtpVerified(true);
//       setEmailVerified(true); // Mark email as verified
//       localStorage.setItem('email', email);
//       onOtpVerified();
//     } catch (error) {
//       setErrorMessage("Invalid OTP or expired");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       setResendLoading(true);
//       const response = await resendEmailOtp(email);

//       if (response.status === 200) {
//         setErrorMessage("OTP has been resent to your email.");
//       }
//     } catch (error) {
//       setErrorMessage("Error resending OTP. Please try again.");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   const handlePhoneVerified = () => {
//     setPhoneVerified(true); // Set phoneVerified to true once phone is verified
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-full max-w-sm p-6 border rounded-lg">
//         {!otpSent ? (
//           <EmailInput
//             handleSubmitEmail={handleSubmitEmail}
//             loading={loading}
//             errorMessage={errorMessage}
//           />
//         ) : !otpVerified ? (
//           <>
//             <OtpInput
//               handleVerifyOtp={handleVerifyOtp}
//               loading={loading}
//               errorMessage={errorMessage}
//             />
//             <ResendOtp
//               handleResendOtp={handleResendOtp}
//               resendLoading={resendLoading}
//             />
//           </>
//         ) : emailVerified ? (
//           !phoneVerified ? (
//             <PhoneForm
//               onPhoneVerified={handlePhoneVerified}
//               email={email}
//             />
//           ) : (
//             <PasswordForm />
//           )
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default EmailForm;


import { useState } from "react";
import EmailInput from "./EmailInput";
import OtpInput from "./OtpInput";
import ResendOtp from "./ResendOtp";
import PhoneForm from "./PhoneForm";
import PasswordForm from "./PasswordForm";
import { createCandidate } from "../../api/candidate";
import { resendEmailOtp, verifyOtp } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UpdateCandidateForm from "../candidate/profileDetails/UpdateCandidateForm";

const EmailForm = ({ onOtpVerified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const navigate = useNavigate();

  const handleSubmitEmail = async (email) => {
    try {
      setErrorMessage("");
      setLoading(true);

      const response = await createCandidate(email);

      if (response.status === 201) {
        setEmail(email);
        setOtpSent(true);
      }
    } catch (error) {
      if (error.response && error.response.data.code === 'EMAIL_ALREADY_EXISTS') {
        localStorage.setItem('email', email);
        toast.error('Account exists with this email. Please Login');
        navigate('/signin');
      } else {
        toast.error('Error sending OTP. Please try again.');
        setErrorMessage("Error sending OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    try {
      setErrorMessage("");
      setLoading(true);

      await verifyOtp(email, otp);
      toast.success("Email Verified")
      setOtpVerified(true);
      setEmailVerified(true); // Mark email as verified
      localStorage.setItem('email', email);
      onOtpVerified();
    } catch (error) {
      setErrorMessage("Invalid OTP or expired");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const response = await resendEmailOtp(email);

      if (response.status === 200) {
        setErrorMessage("OTP has been resent to your email.");
      }
    } catch (error) {
      setErrorMessage("Error resending OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handlePhoneVerified = () => {
    setPhoneVerified(true);
  };

  const handlePasswordUpdated = () => {
    setPasswordUpdated(true);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-sm p-6 border rounded-lg  ">
          {!otpSent ? (
            <EmailInput
              handleSubmitEmail={handleSubmitEmail}
              loading={loading}
              errorMessage={errorMessage}
            />
          ) : !otpVerified ? (
            <>
              <OtpInput
                handleVerifyOtp={handleVerifyOtp}
                loading={loading}
                errorMessage={errorMessage}
              />
              <ResendOtp
                handleResendOtp={handleResendOtp}
                resendLoading={resendLoading}
              />
            </>
          ) : emailVerified ? (
            !phoneVerified ? (
              <PhoneForm
                onPhoneVerified={handlePhoneVerified}
                email={email}
              />
            ) : passwordUpdated ? (
              <UpdateCandidateForm />
            ) : (
              <PasswordForm onPasswordUpdated={handlePasswordUpdated} />
            )
          ) : null}
        </div>
      </div>

    </>
  );
};

export default EmailForm;
