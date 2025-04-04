import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseURL } from '../../config/baseURL';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/auth/password-reset-email`, { email });
      if (response.status === 200) {
        toast.success('Password reset email link sent successfully to your email. Please check.');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error('No account exists with this email ID.');
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full sm:w-96 mt-4 mb-4 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-2xl font-semibold text-gray-800">Enter Your Email</h1>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      <div className="mt-4 text-center">
        <div>
          Remember Password{' '}
          <button
            onClick={() => navigate('/signin')}
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

export default ForgotPassword;
