import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Pastikan path ini benar

function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      {" "}
      {/* Gunakan class dari CSS Anda */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      <main className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Di sinilah DashboardPage, ProposalsPage, dll, akan dirender */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
