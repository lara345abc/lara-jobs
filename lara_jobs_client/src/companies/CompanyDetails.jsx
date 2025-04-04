import React, { useState, useEffect } from "react";
import { getAllCompanies } from "../api/companiesApi";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/20/solid";

const CompanyDetails = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    district: "",
    state: "",
    pincode: ""
  });
  const [uniqueValues, setUniqueValues] = useState({
    locations: [],
    districts: [],
    states: [],
    pincodes: []
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies();
        setCompanies(response.data);

        // Extract unique values for each filter field
        const locations = [...new Set(response.data.map((company) => company.location))];
        const districts = [...new Set(response.data.map((company) => company.district))];
        const states = [...new Set(response.data.map((company) => company.state))];
        const pincodes = [...new Set(response.data.map((company) => company.pincode))];

        setUniqueValues({
          locations,
          districts,
          states,
          pincodes
        });
      } catch (error) {
        setError("Error fetching companies");
      }
    };

    fetchCompanies();
  }, []);

  // Filter function to filter companies based on the search query and filters
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
        (lowercasedName.includes(lowercasedSearchQuery) || 
        lowercasedPhone.includes(lowercasedSearchQuery) || 
        lowercasedEmail.includes(lowercasedSearchQuery)) &&
        (filters.location ? lowercasedLocation === filters.location.toLowerCase() : true) &&
        (filters.district ? lowercasedDistrict === filters.district.toLowerCase() : true) &&
        (filters.state ? lowercasedState === filters.state.toLowerCase() : true) &&
        (filters.pincode ? lowercasedPincode === filters.pincode.toLowerCase() : true)
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Companies</h2>
      
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Section */}
      <div className="mb-4 flex space-x-4">
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
            <option key={index} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={filters.district}
          onChange={(e) => setFilters({ ...filters, district: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select District</option>
          {uniqueValues.districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>

        <select
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select State</option>
          {uniqueValues.states.map((state, index) => (
            <option key={index} value={state}>{state}</option>
          ))}
        </select>

        <select
          value={filters.pincode}
          onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Pincode</option>
          {uniqueValues.pincodes.map((pincode, index) => (
            <option key={index} value={pincode}>{pincode}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto text-black">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-gray-700">Company Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Website</th>
              <th className="px-4 py-2 text-left text-gray-700">Contact Phone</th>
              <th className="px-4 py-2 text-left text-gray-700">Contact Email</th>
              <th className="px-4 py-2 text-left text-gray-700">Location</th>
              <th className="px-4 py-2 text-left text-gray-700">Pincode</th>
              <th className="px-4 py-2 text-left text-gray-700">District</th>
              <th className="px-4 py-2 text-left text-gray-700">State</th>
            </tr>
          </thead>
          <tbody>
            {filterCompanies().map((company) => (
              <tr key={company.company_id} className="border-b">
                <td className="px-4 py-2">{company.company_name}</td>
                <td className="px-4 py-2">
                  <a
                    href={company.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {company.website_url}
                  </a>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-5 w-5 text-gray-500" />
                    <span>{company.contact_phone}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                    <span>{company.contact_email}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500" />
                    <span>{company.location}</span>
                  </div>
                </td>
                <td className="px-4 py-2">{company.pincode}</td>
                <td className="px-4 py-2">{company.district}</td>
                <td className="px-4 py-2">{company.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyDetails;
