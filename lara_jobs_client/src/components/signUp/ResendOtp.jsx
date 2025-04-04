import { ArrowLeftIcon } from "@heroicons/react/16/solid";

const ResendOtp = ({ handleResendOtp, resendLoading }) => (
    <div className="mt-4 flex justify-between">
      <button
        onClick={() => window.history.back()} 
        className="w-8 bg-gray-500 text-white rounded-md text-center"
      >
        <ArrowLeftIcon />
      </button>
      <button
        onClick={handleResendOtp}
        className="w-32 bg-green-500 text-white py-2 rounded-md"
        disabled={resendLoading}
      >
        {resendLoading ? "Resending..." : "Resend OTP"}
      </button>
    </div>
  );
  
  export default ResendOtp;
  