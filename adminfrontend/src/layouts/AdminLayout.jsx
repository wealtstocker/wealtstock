import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import BreadcrumbNav from "../lib/BreadcrumbNav";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // start closed for mobile

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/* Header (Fixed) */}
      <DashboardHeader
        onMenuClick={handleSidebarToggle}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Responsive Flex Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <DashboardSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

        {/* Main Content */}
        <div
          className={`flex-1 w-full transition-all duration-500 ease-in-out px-3 sm:px-6 md:px-8 ${
            isSidebarOpen ? "md:ml-72" : ""
          }`}
        >
          <main className="mt-3 min-h-screen">
            <BreadcrumbNav />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
