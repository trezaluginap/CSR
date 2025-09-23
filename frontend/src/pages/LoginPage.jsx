// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - replace with real API call
      if (formData.username === "admin" && formData.password === "admin123") {
        const mockUser = {
          id: 1,
          username: "admin",
          email: "admin@company.com",
          role: "Administrator",
          permissions: ["read", "write", "delete", "admin"],
        };

        const mockToken = "mock-jwt-token-" + Date.now();

        // Store in localStorage
        localStorage.setItem("admin_token", mockToken);
        localStorage.setItem("admin_user", JSON.stringify(mockUser));

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Username atau password salah");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { username: "admin", password: "admin123", role: "Administrator" },
    { username: "manager", password: "manager123", role: "Manager" },
    { username: "staff", password: "staff123", role: "Staff" },
  ];

  const fillDemoCredentials = (credentials) => {
    setFormData((prev) => ({
      ...prev,
      username: credentials.username,
      password: credentials.password,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />
              </svg>
            </div>
            <h1>Sistem Monitoring CSR</h1>
            <p>
              Platform manajemen Corporate Social Responsibility yang
              komprehensif untuk mengelola proposal dan program CSR perusahaan.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <span>Kelola proposal CSR dengan mudah</span>
              </div>
              <div className="feature-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <span>Tracking status real-time</span>
              </div>
              <div className="feature-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                <span>Laporan dan analisis komprehensif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2>Masuk ke Admin Panel</h2>
              <p>Masukkan kredensial Anda untuk mengakses dashboard</p>
            </div>

            {error && (
              <div className="error-alert">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Masukkan username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Ingat saya</span>
                </label>

                <a href="#" className="forgot-password">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                className={`login-btn ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="demo-section">
              <div className="demo-header">
                <h4>Demo Credentials</h4>
                <p>Gunakan kredensial berikut untuk testing:</p>
              </div>

              <div className="demo-credentials">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    type="button"
                    className="demo-btn"
                    onClick={() => fillDemoCredentials(cred)}
                    disabled={loading}
                  >
                    <div className="demo-info">
                      <strong>{cred.username}</strong>
                      <span className="demo-role">{cred.role}</span>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="login-footer">
              <p>&copy; 2025 CSR Monitoring System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
