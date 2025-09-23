// index.js (Versi Final yang Sudah Diperbaiki)

const express = require("express");
const cors = require("cors"); // <-- 1. IMPORT CORS DI SINI

const sequelize = require("./src/config/database");
const picRoutes = require("./src/routes/pic.routes");
const proposalRoutes = require("./src/routes/proposal.routes");

const app = express();
const port = 5000;

// ==========================================================
// MIDDLEWARE
// Tempatkan middleware di bagian atas, sebelum routes
// ==========================================================
app.use(cors()); // <-- 2. GUNAKAN CORS DI SINI
app.use(express.json());

// Fungsi untuk mengetes koneksi database (lebih aman daripada sync)
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi ke database berhasil.");
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error);
  }
};
testDbConnection();

// Route dasar untuk mengecek server
app.get("/", (req, res) => {
  res.send("Halo, ini adalah server backend CSR!");
});

// ==========================================================
// ROUTES
// Daftarkan semua route Anda di sini
// ==========================================================
app.use("/api/pic", picRoutes);
app.use("/api/proposals", proposalRoutes);

// Menjalankan server
app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
