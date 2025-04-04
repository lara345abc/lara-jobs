import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, ArrowRightEndOnRectangleIcon, AcademicCapIcon, ClipboardDocumentListIcon, BuildingOffice2Icon, BuildingOfficeIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/20/solid";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route path
  const [isManageQuestionsOpen, setIsManageQuestionsOpen] = useState(false);
  const [isManageCompaniesOpen, setIsManageCompaniesOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('candidate_id');
    window.location.href = "/signin";
  };

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col h-screen p-3 bg-orange-500 shadow w-60">
      <div className="space-y-3">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {/* Home Link */}
            <li className={`rounded-sm ${isActive("/common-dashboard") ? 'bg-indigo-700' : ''}`}>
              <button
                onClick={() => navigate("/common-dashboard")}
                className={`flex items-center p-2 space-x-3 rounded-md w-full ${isActive("/common-dashboard") ? 'text-white' : 'text-gray-100'}`}
              >
                <HomeIcon className="w-6 h-6" />
                <span>Home</span>
              </button>
            </li>

            {/* Manage Subjects Link */}
            <li className={`rounded-sm ${isActive('/admin/subject/add-subject') ? 'bg-indigo-700' : ''}`}>
              <button
                onClick={() => navigate('/admin/subject/add-subject')}
                className={`flex items-center p-2 space-x-3 rounded-md w-full ${isActive('/admin/subject/add-subject') ? 'text-white' : 'text-gray-100'}`}
              >
                <AcademicCapIcon className="w-6 h-6" />
                <span>Manage Subjects</span>
              </button>
            </li>

            {/* Manage Questions / Test Links */}
            <li className={`rounded-sm ${isActive('/admin/testlink/create') || isActive('/admin/testlink/all-links') ? 'bg-indigo-700' : ''}`}>
              <button
                onClick={() => setIsManageQuestionsOpen(!isManageQuestionsOpen)}
                className={`flex items-center p-2 space-x-3 rounded-md w-full ${isActive('/admin/testlink/create') || isActive('/admin/testlink/all-links') ? 'text-white' : 'text-gray-100'}`}
              >
                <ClipboardDocumentListIcon className="w-6 h-6" />
                <span>Test Link</span>
              </button>

              {/* Sub-menu for Managing Questions */}
              {isManageQuestionsOpen && (
                <ul className="space-y-1 pl-6 mt-2">
                  <li>
                    <button
                      onClick={() => navigate("/admin/testlink/create")}
                      className={`flex items-center p-2 text-gray-100 rounded-md hover:bg-indigo-700 ${isActive("/admin/testlink/create") ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      <PencilIcon className="w-4 me-2"/>
                      <span>Create Test link</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/admin/testlink/all-links")}
                      className={`flex items-center p-2 text-gray-100 rounded-md hover:bg-indigo-700 ${isActive("/admin/testlink/all-links") ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      <ListBulletIcon className="w-4 me-2"/>
                      <span>Test Links</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Manage Companies  */}
            <li className={`rounded-sm ${isActive('/admin/company/create') || isActive('/admin/company/companies-list') || isActive('/admin/company/upload') ? 'bg-indigo-700' : ''}`}>
              <button
                onClick={() => setIsManageCompaniesOpen(!isManageCompaniesOpen)}
                className={`flex items-center p-2 space-x-3 rounded-md w-full ${isActive('/admin/company/create') || isActive('/admin/company/companies-list') ? 'text-white' : 'text-gray-100'}`}
              >
                <BuildingOffice2Icon className="w-6 h-6" />
                <span>Manage Companies</span>
              </button>

              {/* Sub-menu for Managing Questions */}
              {isManageCompaniesOpen && (
                <ul className="space-y-1 pl-6 mt-2">
                  <li>
                    <button
                      onClick={() => navigate("/admin/company/create")}
                      className={`flex items-center p-2 text-gray-100 rounded-md hover:bg-indigo-700 ${isActive("/admin/company/create") ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      <BuildingOfficeIcon className="w-4 me-2"/>
                      <span>Add Company</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/admin/company/upload")}
                      className={`flex items-center p-2 text-gray-100 rounded-md hover:bg-indigo-700 ${isActive("/admin/company/upload") ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      <ArrowUpIcon className="w-4 me-2"/>
                      <span>Uplaod Companies</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate("/admin/company/companies-list")}
                      className={`flex items-center p-2 text-gray-100 rounded-md hover:bg-indigo-700 ${isActive("/admin/company/companies-list") ? 'bg-indigo-600 text-white' : ''}`}
                    >
                      <ListBulletIcon className="w-4 me-2"/>
                      <span>Companies List</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Logout Link */}
            <li className="rounded-sm">
              <button
                onClick={logout}
                className="flex items-center p-2 space-x-3 rounded-md w-full text-gray-100"
              >
                <ArrowRightEndOnRectangleIcon className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
