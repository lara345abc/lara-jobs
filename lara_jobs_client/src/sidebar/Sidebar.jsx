import { ChartPieIcon } from "@heroicons/react/16/solid";
import { ArrowRightEndOnRectangleIcon, BuildingOfficeIcon, CogIcon, HomeIcon } from "@heroicons/react/20/solid";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location (route)

    const logout = () => {
        // Remove items from localStorage
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('candidate_id');

        toast.success("Logout Success");

        window.location.href = "/signin";
    };

    // Helper function to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex flex-col h-screen p-3 bg-orange-500 shadow w-60">
            <div className="space-y-3">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold text-white">Dashboard</h2>
                </div>

                <div className="flex-1">
                    <ul className="pt-2 pb-4 space-y-1 text-sm">
                        {/* Home Link */}
                        {/* <li className={`rounded-sm ${isActive("/common-dashboard") ? 'bg-gray-700' : ''}`}>
                            <button
                                onClick={() => navigate("/common-dashboard")}
                                className={`flex items-center p-2 space-x-3 rounded-md ${isActive("/common-dashboard") ? 'text-white' : 'text-gray-100'}`}
                            >
                                <HomeIcon className="w-6 h-6" />
                                <span>Home</span>
                            </button>
                        </li> */}

                        {/* Dashboard Link */}
                        <li className={`rounded-sm ${isActive("/common-dashboard") ? 'bg-gray-700' : ''}`}>
                            <button
                                onClick={() => navigate("/common-dashboard")}
                                className={`flex items-center p-2 space-x-3 rounded-md ${isActive("/common-dashboard") ? 'text-white' : 'text-gray-100'}`}
                            >
                                <ChartPieIcon className="w-6 h-6" />
                                <span>Dashboard</span>
                            </button>
                        </li>
                        <li className={`rounded-sm ${isActive("/candidate/companies/show") ? 'bg-gray-700' : ''}`}>
                            <button
                                onClick={() => navigate("/candidate/companies/show")}
                                className={`flex items-center p-2 space-x-3 rounded-md ${isActive("/candidate/companies/show") ? 'text-white' : 'text-gray-100'}`}
                            >
                                <BuildingOfficeIcon className="w-6 h-6" />
                                <span>Companies</span>
                            </button>
                        </li>

                        {/* Settings Link */}
                        {/* <li className={`rounded-sm ${isActive("/settings") ? 'bg-gray-700' : ''}`}>
                            <button
                                onClick={() => navigate("/settings")}
                                className={`flex items-center p-2 space-x-3 rounded-md ${isActive("/settings") ? 'text-white' : 'text-gray-100'}`}
                            >
                                <CogIcon className="w-6 h-6" />
                                <span>Settings</span>
                            </button>
                        </li> */}

                        {/* Logout Link */}
                        <li className="rounded-sm">
                            <button
                                onClick={logout}
                                className="flex items-center p-2 space-x-3 rounded-md text-gray-100"
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

export default Sidebar;
