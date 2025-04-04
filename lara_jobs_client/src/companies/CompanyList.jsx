import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCompany, getAllCompanies } from "../api/companiesApi";
import toast from "react-hot-toast";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [uniqueValues, setUniqueValues] = useState({
    locations: [],
    districts: [],
    states: [],
    pincodes: [],
  });

  // Fetch companies and apply search/filter logic
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        const data = response.data;
        setCompanies(data);
        setFilteredCompanies(data);

        // Extract unique values for filter dropdowns
        const locations = [...new Set(data.map((company) => company.location))];
        const districts = [...new Set(data.map((company) => company.district))];
        const states = [...new Set(data.map((company) => company.state))];
        const pincodes = [...new Set(data.map((company) => company.pincode))];

        setUniqueValues({
          locations,
          districts,
          states,
          pincodes,
        });
      } catch (error) {
        setError("Error fetching companies");
        toast.error("Error fetching companies");
      }
    };

    fetchCompanies();
  }, []);

  // Filter function to apply search and filter logic
  const filterCompanies = () => {
    return companies.filter((company) => {
      const lowercasedSearchQuery = searchQuery.toLowerCase();
      const lowercasedName = company.company_name.toLowerCase();
      const lowercasedPhone = company.contact_phone.toLowerCase();
      const lowercasedEmail = company.contact_email.toLowerCase();
      const lowercasedLocation = company.location.toLowerCase();
      const lowercasedDistrict = company.district.toLowerCase();
      const lowercasedState = company.state.toLowerCase();
      const lowercasedPincode = company.pincode.toLowerCase();

      return (
        // Search filter by name, phone, or email
        (lowercasedName.includes(lowercasedSearchQuery) ||
          lowercasedPhone.includes(lowercasedSearchQuery) ||
          lowercasedEmail.includes(lowercasedSearchQuery)) &&
        // Location filter
        (filters.location
          ? lowercasedLocation === filters.location.toLowerCase()
          : true) &&
        // District filter
        (filters.district
          ? lowercasedDistrict === filters.district.toLowerCase()
          : true) &&
        // State filter
        (filters.state
          ? lowercasedState === filters.state.toLowerCase()
          : true) &&
        // Pincode filter
        (filters.pincode
          ? lowercasedPincode === filters.pincode.toLowerCase()
          : true)
      );
    });
  };

  // Update filtered companies when the search query or filters change
  useEffect(() => {
    setFilteredCompanies(filterCompanies());
  }, [searchQuery, filters, companies]);

  const handleDelete = async (companyId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this company?");
    
    if (isConfirmed) {
      try {
        await deleteCompany(companyId);
        setCompanies(companies.filter((company) => company.company_id !== companyId));
        toast.success("Company deleted successfully!");
      } catch (error) {
        setError("Error deleting company");
        toast.error("Error deleting company");
      }
    } else {
      toast.error("Company deletion was canceled.");
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Companies List</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Search Section */}
      <div className="mb-4 flex space-x-4 text-black">
        <input
          type="text"
          placeholder="Search by name, phone, email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Filters Section */}
      <div className="mb-4 flex space-x-4 text-black">
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Location</option>
          {uniqueValues.locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select District</option>
          {uniqueValues.districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        <select
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select State</option>
          {uniqueValues.states.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={filters.pincode}
          onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Pincode</option>
          {uniqueValues.pincodes.map((pincode, index) => (
            <option key={index} value={pincode}>
              {pincode}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto text-black">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-gray-700">Company Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Website</th>
              <th className="px-4 py-2 text-left text-gray-700">Location</th>
              <th className="px-4 py-2 text-left text-gray-700">District</th>
              <th className="px-4 py-2 text-left text-gray-700">State</th>
              <th className="px-4 py-2 text-left text-gray-700">Pincode</th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.company_id} className="border-b">
                <td className="px-4 py-2">{company.company_name}</td>
                <td className="px-4 py-2">{company.website_url}</td>
                <td className="px-4 py-2">{company.location}</td>
                <td className="px-4 py-2">{company.district}</td>
                <td className="px-4 py-2">{company.state}</td>
                <td className="px-4 py-2">{company.pincode}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-4">
                    <Link
                      to={`/admin/company/edit/${company.company_id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(company.company_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
