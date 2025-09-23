import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Import Halaman dan Komponen
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

// Import CSS (pastikan semua path ini benar)
import "./styles/DashboardPage.css";
import "./styles/LoginPage.css";
import "./App.css";

// Komponen sementara untuk halaman lain
const ComingSoonPage = ({ title }) => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>{title}</h1>
    <p>Halaman ini sedang dalam pengembangan.</p>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-fullscreen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* ========================================================== */}
        {/* GRUP 1: RUTE PUBLIK (TIDAK PAKAI SIDEBAR) */}
        {/* ========================================================== */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* ========================================================== */}
        {/* GRUP 2: RUTE TERPROTEKSI (SELALU PAKAI SIDEBAR & HEADER) */}
        {/* ========================================================== */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Semua Route di dalam sini akan otomatis memiliki layout Sidebar & Header */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/proposals"
            element={<ComingSoonPage title="Kelola Proposal" />}
          />
          <Route
            path="/admin/*"
            element={<ComingSoonPage title="Kelola Admin" />}
          />
          <Route path="/pic" element={<ComingSoonPage title="Kelola PIC" />} />
          <Route
            path="/reports/*"
            element={<ComingSoonPage title="Laporan" />}
          />
          <Route
            path="/settings/*"
            element={<ComingSoonPage title="Pengaturan" />}
          />
        </Route>

        {/* ========================================================== */}
        {/* RUTE PENGALIHAN DEFAULT */}
        {/* ========================================================== */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rute 404 Not Found */}
        <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
