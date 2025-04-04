import React, { useState } from "react";
import toast from "react-hot-toast";
import { uploadExcelFile } from "../api/companiesApi";

const UploadCompaniesExcel = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      toast.error("Please select an Excel file to upload");
      return;
    }
  
    const fileExtension = file.name.split('.').pop();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      toast.error("Only Excel files are allowed");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    setIsLoading(true);
  
    try {
      const response = await uploadExcelFile(formData);
      toast.success(response.message || "Companies uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Upload Company Data (Excel)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <label htmlFor="file" className="text-lg text-gray-700">Select Excel File</label>
          <input
            type="file"
            id="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="mt-2 p-2 border border-gray-300 rounded-md"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-500">Selected File: {file.name}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCompaniesExcel;
