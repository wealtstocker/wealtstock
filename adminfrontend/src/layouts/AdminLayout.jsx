import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import BreadcrumbNav from "../lib/BreadcrumbNav";


const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50 relative overflow-x-hidden">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

      {/* Main Area */}
     <div
        className={`flex-1 transition-all duration-600 ease-in-out ${isSidebarOpen ? "ml-1 md:ml-72" : "ml-0"
          }`}
      >
        <DashboardHeader
          onMenuClick={handleSidebarToggle}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="pt-16 mt-3 min-h-screen">
          <BreadcrumbNav />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
