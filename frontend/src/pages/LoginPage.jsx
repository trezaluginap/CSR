import { useState } from "react";
// useNavigate tidak lagi diperlukan di sini karena kita akan me-reload halaman
import authService from "../api/authService"; // <-- 1. IMPORT SERVICE OTENTIKASI
import "../styles/LoginPage.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // 2. MENGGANTI LOGIKA MOCK DENGAN PANGGILAN API NYATA
      await authService.login(formData.username, formData.password);

      // 3. RELOAD HALAMAN SETELAH LOGIN BERHASIL
      // Ini akan membuat App.jsx membaca token baru dan mengarahkan ke dashboard
      window.location.reload();
    } catch (err) {
      // 4. MENANGKAP DAN MENAMPILKAN ERROR DARI BACKEND
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { username: "admin", password: "admin123", role: "Administrator" },
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
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2>Masuk ke Admin Panel</h2>
              <p>Masukkan kredensial Anda untuk mengakses dashboard</p>
            </div>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
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
                    // ... (logika rememberMe bisa diimplementasikan nanti)
                  />
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
                  <span>Masuk</span>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="demo-section">
              <div className="demo-header">
                <h4>Demo Credentials</h4>
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
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
