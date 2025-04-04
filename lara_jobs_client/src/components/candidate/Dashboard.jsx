import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import AdminSidebar from "../../sidebar/AdminSidebar";
import BackButton from "../../sidebar/BackButton";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Show AdminSidebar if user is admin, else show regular Sidebar */}
      <div className="hidden lg:flex lg:w-60 bg-orange-500">
        {userRole === "ADMIN" ? <AdminSidebar /> : <Sidebar userRole={userRole} />}
      </div>

      {/* Main content area where components will be rendered */}
      <div className="flex-1 bg-indigo-500  p-4 text-gray-800 dark:text-white overflow-x-auto">
        <BackButton />
        <Outlet /> {/* This is where nested routes will render */}
      </div>
    </div>
  );
};

export default Dashboard;
