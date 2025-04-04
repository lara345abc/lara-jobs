import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCompany, updateCompany, getCompanyById } from "../api/companiesApi";
import toast from 'react-hot-toast';

const CompanyForm = ({ isEditMode = false }) => {
    const [companyData, setCompanyData] = useState({
        company_name: "",
        website_url: "",
        contact_phone: "",
        contact_email: "",
        pincode: "",
        location: "",
        district: "",
        state: "",
    });
    const [loading, setLoading] = useState(false);
    const { companyId } = useParams();
    const navigate = useNavigate();

    // Fetch existing company data when in edit mode
    useEffect(() => {
        const fetchCompanyData = async () => {
            if (isEditMode && companyId) {
                setLoading(true);
                try {
                    const response = await getCompanyById(companyId);
                    setCompanyData(response.data);
                } catch (error) {
                    toast.error("Error fetching company data");
                    navigate("/admin/company/companies-list"); 
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCompanyData();
    }, [isEditMode, companyId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({
            ...companyData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await updateCompany(companyId, companyData);
            } else {
                await createCompany(companyData);
            }
            navigate("/admin/company/companies-list");
            toast.success("Company saved successfully!");
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        }
    };

    // Clear form and reset state to add a new company
    const handleClearForm = () => {
        setCompanyData({
            company_name: "",
            website_url: "",
            contact_phone: "",
            contact_email: "",
            pincode: "",
            location: "",
            district: "",
            state: "",
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-5 p-4 bg-white shadow-md rounded-lg text-black">
            <h2 className="text-2xl font-semibold mb-4">
                {isEditMode ? "Edit Company" : "Create New Company"}
            </h2>

            {/* Display form state information */}
            <p className="text-gray-600 mb-4">
                {isEditMode ? "Edit the company details below" : "Fill out the form to create a new company."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Company Name</label>
                    <input
                        type="text"
                        name="company_name"
                        value={companyData.company_name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Website URL</label>
                    <input
                        type="text"
                        name="website_url"
                        value={companyData.website_url}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Contact Phone</label>
                    <input
                        type="text"
                        name="contact_phone"
                        value={companyData.contact_phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Contact Email</label>
                    <input
                        type="email"
                        name="contact_email"
                        value={companyData.contact_email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={companyData.pincode}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={companyData.location}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">District</label>
                    <input
                        type="text"
                        name="district"
                        value={companyData.district}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">State</label>
                    <input
                        type="text"
                        name="state"
                        value={companyData.state}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded-md"
                >
                    {isEditMode ? "Update Company" : "Create Company"}
                </button>
            </form>

        </div>
    );
};

export default CompanyForm;
