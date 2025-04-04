import { ArrowLeftCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate(); 

  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <button 
      onClick={handleGoBack}
      className="flex items-center text-white  rounded-md "
    >
      <ArrowLeftCircleIcon className="w-8 h-8 " /> 
    </button>
  );
};

export default BackButton;
