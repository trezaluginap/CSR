import React from "react";
import { Navigate } from "react-router-dom";

// Komponen ini bertugas melindungi sebuah halaman.
// Ia menerima dua props:
// 1. isAuthenticated: boolean yang menandakan status login
// 2. children: komponen halaman yang ingin dilindungi (misal: <DashboardPage />)

function ProtectedRoute({ isAuthenticated, children }) {
  // Jika pengguna tidak terotentikasi (belum login)
  if (!isAuthenticated) {
    // Arahkan (redirect) mereka ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika pengguna sudah login, tampilkan halaman yang diminta (children)
  return children;
}

export default ProtectedRoute;
