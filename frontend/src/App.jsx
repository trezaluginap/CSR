import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Import Halaman dan Komponen
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPages.jsx";
import ""
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/mainLayout.jsx";

// Import CSS
import "./styles/DashboardPages.css";
import "./styles/LoginPage.css";
import "./App.css";

const ComingSoonPage = ({ title }) => (
  <div style={{ padding: "2rem", textAlign: "center", width: "100%" }}>
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
    return <div className="loading-fullscreen">Memuat Aplikasi...</div>;
  }

  // PERHATIKAN: <Router> sudah dihapus. Langsung <Routes>.
  return (
    <Routes>
      {/* GRUP 1: RUTE PUBLIK */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* GRUP 2: RUTE PRIVAT */}
      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
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
        <Route path="/reports/*" element={<ComingSoonPage title="Laporan" />} />
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

      {/* Rute 404 */}
      <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
    </Routes>
  );
}

export default App;
