import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import React from 'react';

const MalpracticeDetected = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <ExclamationTriangleIcon size={50} className="text-red-600 mb-4 mx-auto" />
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Malpractice Detected</h2>
        <p className="mb-6 text-gray-700">
          We have detected malpractice during your test. As a result, your test has been terminated. Please adhere to the rules and regulations in future assessments.
        </p>
        {/* <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Go to Homepage</button> */}
      </div>
    </div>
  );
};

export default MalpracticeDetected;
