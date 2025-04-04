import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const OtpInput = ({ handleVerifyOtp, loading, errorMessage }) => {
  const otpValidationSchema = Yup.object({
    otp: Yup.string().length(6, 'Enter 6 digit OTP sent to your email').required('OTP required'),
  });

  return (
    <Formik
      initialValues={{ otp: "" }}
      validationSchema={otpValidationSchema}
      onSubmit={({ otp }) => handleVerifyOtp(otp)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <p className="text-success">An 6 digit OTP has been sent to your email Please verify </p>
          <div className="mb-4">
            <Field
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-md"
              value={values.otp}
              onChange={(e) => setFieldValue("otp", e.target.value)}
            />
            <div className="text-red-500 text-sm">
              <ErrorMessage name="otp" />
            </div>
          </div>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default OtpInput;
