import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const Loading = () => {
  return (
    <div className="flex justify-center items-center space-x-2 h-96 bg-slate-700 ">
      <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
      <span className="text-lg text-white">Loading...</span>
    </div>
  );
};

export default Loading;
