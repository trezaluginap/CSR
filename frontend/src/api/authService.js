import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/"; // Arahkan ke route otentikasi

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(API_URL + "login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error(
        "Login service error:",
        error.response?.data || error.message
      );
      if (error.response) {
        throw new Error(
          error.response.data.message || "Terjadi kesalahan pada server"
        );
      } else if (error.request) {
        throw new Error(
          "Tidak dapat terhubung ke server. Periksa koneksi Anda."
        );
      } else {
        throw new Error("Terjadi kesalahan saat melakukan login.");
      }
    }
  }

  logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("admin_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.logout(); // Hapus data yang rusak
      return null;
    }
  }

  getToken() {
    return localStorage.getItem("admin_token");
  }

  // Fungsi canggih untuk setup interceptor
  setupAxiosInterceptors() {
    // 1. Interceptor untuk Request (Mengirim token)
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 2. Interceptor untuk Response (Menangani error 401 Unauthorized)
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Jika token tidak valid/expired, otomatis logout
          this.logout();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }
}

export default new AuthService();
