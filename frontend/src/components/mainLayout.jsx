import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Pastikan path ini benar

function MainLayout() {
  const [sidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar akan selalu tampil di layout ini */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Konten halaman akan dirender di sini */}
      <main className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
