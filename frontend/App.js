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

// Import CSS
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
  // FIX: Nilai awal HARUS false. Anggap pengguna belum login sampai terbukti.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek token di local storage saat aplikasi pertama kali dimuat
    const token = localStorage.getItem("admin_token");
    if (token) {
      // Jika ada token, anggap pengguna sudah login
      setIsAuthenticated(true);
    }
    // Selesai memeriksa, matikan status loading
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-fullscreen">Loading...</div>; // Tampilan loading sederhana
  }

  return (
    <Router>
      <Routes>
        {/* RUTE PUBLIK (Tanpa Sidebar/Layout) */}
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

        {/* RUTE YANG DILINDUNGI (Menggunakan MainLayout) */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Semua Route di dalam sini akan memiliki Sidebar & Header */}
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

        {/* Rute Default */}
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
