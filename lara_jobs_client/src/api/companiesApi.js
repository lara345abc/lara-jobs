import axios from "axios";
import { baseURL } from "../config/baseURL";



const createCompany = async (companyData) => {
  try {
    const response = await axios.post(`${baseURL}/api/company/save-company`, companyData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : "Error creating company";
  }
};

const getCompanyById = async (companyId) => {
  try {
    const response = await axios.get(`${baseURL}/api/company/get-company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : "Error fetching company details";
  }
};

const getAllCompanies = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/company/get-all-companies`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : "Error fetching companies";
  }
};

const updateCompany = async (companyId, companyData) => {
  try {
    const response = await axios.put(`${baseURL}/api/company/update-company/${companyId}`, companyData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : "Error updating company";
  }
};

const deleteCompany = async (companyId) => {
  try {
    const response = await axios.delete(`${baseURL}/api/company/delete-company/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : "Error deleting company";
  }
};

const uploadExcelFile = async (formData) => {
    try {
      
  
      const response = await axios.post(`${baseURL}/api/company/upload-excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } catch (error) {
        console.log("Erroro while uploading companies ", error)
      throw error.response ? error.response.data.message : "Error uploading Excel file";
    }
  };

export { createCompany, getCompanyById, getAllCompanies, updateCompany, deleteCompany, uploadExcelFile };
