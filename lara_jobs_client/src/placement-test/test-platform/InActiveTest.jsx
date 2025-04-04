import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';

const InActiveTest = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg transform transition duration-500 ">
                <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-red-500 mb-4">Test will be available at the scheduled time</h1>
                <h2 className="text-lg text-gray-600">Please check back later for updates.</h2>
            </div>
        </div>
    );
};

export default InActiveTest;
