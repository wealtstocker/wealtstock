import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import BreadcrumbNav from "../lib/BreadcrumbNav";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen md:flex bg-gray-50 relative overflow-x-hidden">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main Area */}
     <div
        className={`md:flex-1 transition-all duration-600 ease-in-out ${isSidebarOpen ? "ml-1 md:ml-72" : "ml-0"
          }`}
      >
        <DashboardHeader
          onMenuClick={handleSidebarToggle}
          isSidebarOpen={isSidebarOpen}
        />
       <main className="pt-16 px-3  pb-10">
          <BreadcrumbNav />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
