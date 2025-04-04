import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInUser } from '../../api/auth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import toast from 'react-hot-toast';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // Call login API
      const response = await signInUser(email, password);
      // console.log('token ', response.data.token)
      // console.log('candidate id  ', response.data.unique_id)
      // console.log("email ", response.data)
      if (response.status === 200) {
        toast.success('Login Success');
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('candidate_id', response.data.unique_id)
        localStorage.setItem('role', response.data.role)
        localStorage.setItem('email', response.data.emailId)
        // On success, redirect to dashboard or home

        setTimeout(() => {
          const redirectUrl = sessionStorage.getItem('redirectUrl'); // Check if there's a redirect URL saved in sessionStorage
          // console.log('redirect url to test', redirectUrl);

          if (redirectUrl) {
            // Set email verification status only when redirectUrl exists
            sessionStorage.setItem('isEmailVerified', 'true');  // Save the email verification status when again redirected to test link this will be used
            navigate(redirectUrl);  // Redirect to the test URL
          } else {
            // If no redirect URL exists, navigate to a default page (common-dashboard)
            setTimeout(() => {
              navigate('/common-dashboard');
            }, 1000);
          }
        }, 2000); // Simulate an API request delay of 2 seconds

      }
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-dark-900 ">
      <div className="w-full max-w-md p-8 bg-dark-300 dark:bg-dark-600 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-black">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:text-white dark:border-blue-600"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-700">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:text-white dark:border-blue-600"
              required
            />
            <div
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer mt-3"
            >
              {passwordVisible ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </div>
          </div>

          {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <div>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-sm text-blue-700 hover:underline dark:text-blue-900"
            >
              Click Here.
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div>
            Forgot Password?{' '}
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-sm text-blue-700 hover:underline dark:text-blue-900"
            >
              Click Here.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
