import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const EmailInput = ({ handleSubmitEmail, loading, errorMessage }) => {
  const navigate = useNavigate();
  const emailValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
  });

  const handleSignInRedirect = () => {
    navigate('/signin'); // Navigate to sign-in page when clicked
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={emailValidationSchema}
      onSubmit={({ email }) => handleSubmitEmail(email)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="mb-4">
            <Field
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md"
              value={values.email}
              onChange={(e) => setFieldValue("email", e.target.value)}
            />
            <div className="text-red-500 text-sm">
              <ErrorMessage name="email" />
            </div>
          </div>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Verify"}
          </button>
          <p className="text-center my-3">
            <button type="button" onClick={handleSignInRedirect} className="text-white">
              Have an account? <span className="underline text-blue-900">Sign In</span>
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default EmailInput;
