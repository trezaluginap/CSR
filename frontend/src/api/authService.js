// Mock authentication service for CSR Login System
class AuthService {
  constructor() {
    this.isAuthenticated = false
    this.currentUser = null
  }

  // Mock login method
  async login(username, password) {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Mock validation
        if (username === "admin" && password === "admin123") {
          this.isAuthenticated = true
          this.currentUser = {
            id: 1,
            username: "admin",
            role: "Administrator",
            name: "System Administrator",
          }

          // Store in localStorage for persistence
          localStorage.setItem("auth_token", "mock_token_12345")
          localStorage.setItem("user_data", JSON.stringify(this.currentUser))

          resolve({
            success: true,
            user: this.currentUser,
            token: "mock_token_12345",
          })
        } else {
          reject(new Error("Username atau password tidak valid"))
        }
      }, 1000)
    })
  }

  // Mock logout method
  logout() {
    this.isAuthenticated = false
    this.currentUser = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
  }

  // Check if user is authenticated
  isLoggedIn() {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      this.isAuthenticated = true
      this.currentUser = JSON.parse(userData)
      return true
    }

    return false
  }

  // Get current user data
  getCurrentUser() {
    if (this.isLoggedIn()) {
      return this.currentUser
    }
    return null
  }

  // Get auth token
  getToken() {
    return localStorage.getItem("auth_token")
  }
}

// Create and export a single instance
const authService = new AuthService()
export default authService
