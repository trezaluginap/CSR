"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../styles/DashboardPages.css";

function DashboardPages() {
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentProposal, setCurrentProposal] = useState(null);
  const [picList, setPicList] = useState([]);

  const [formData, setFormData] = useState({
    case_id: "",
    nama: "",
    asal: "",
    status: "In Progress",
    pic_id: "",
    tanggal: new Date().toISOString().split("T")[0],
    bentuk_donasi: "",
    jumlah_produk: "",
    tipe_proposal: "",
    detail_produk: "",
    total_harga: "",
    catatan: "",
    file_pendukung: null,
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch PIC data
  const fetchPICList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pic`);
      if (response.ok) {
        const data = await response.json();
        setPicList(data.data || data);
      }
    } catch (error) {
      console.error("Error fetching PIC list:", error);
      // Fallback PIC data
      setPicList([
        { id_pic: 1, nama_pic: "Pak Ilham", email_pic: "ilham@company.com" },
        { id_pic: 2, nama_pic: "Bu Sarah", email_pic: "sarah@company.com" },
        { id_pic: 3, nama_pic: "Pak Ahmad", email_pic: "ahmad@company.com" },
      ]);
    }
  };

  // Fetch data from API
  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/proposals`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data || result;
      setProposals(data);
      setFilteredProposals(data);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError("Gagal memuat data. Pastikan server backend berjalan.");

      // Enhanced mock data
      const mockData = [
        {
          id_proposal: 1,
          case_id: "CSR-2025-001",
          nama_proposal: "Proposal Bantuan Air Bersih Desa A",
          asal_proposal: "Kepala Desa A",
          tanggal_masuk: "2025-09-19",
          bentuk_donasi: "Air Mineral",
          status_approval: null,
          jumlah_produk: "50 dus 200ml",
          detail_produk: "Air mineral kemasan 200ml, merk Aqua",
          total_harga: "500000",
          tipe_proposal: "Sekali Jalan",
          status_pengambilan: "In Progress",
          id_pic: 1,
          catatan: "Bantuan untuk daerah kekeringan",
          file_pendukung: "proposal_air_bersih.pdf",
          createdAt: "2025-09-19T06:11:20.000Z",
          updatedAt: "2025-09-19T06:12:43.000Z",
          PIC: {
            id_pic: 1,
            nama_pic: "Pak Ilham",
            email_pic: "ilham@company.com",
          },
        },
        {
          id_proposal: 2,
          case_id: "CSR-2625-003",
          nama_proposal: "PHBI MAULID NABI",
          asal_proposal: "MASJID AL-Balman",
          tanggal_masuk: "2025-09-23",
          bentuk_donasi: "Produk",
          status_approval: null,
          jumlah_produk: "30 Box 200M",
          detail_produk: "Produk 30 Box 200M",
          total_harga: "0",
          tipe_proposal: "Sekali Jalan",
          status_pengambilan: "Siap Diambil",
          id_pic: 1,
          catatan: "",
          file_pendukung: "",
          createdAt: "2025-09-23T06:11:20.000Z",
          updatedAt: "2025-09-23T06:12:43.000Z",
          PIC: {
            id_pic: 1,
            nama_pic: "Pak Ilham",
            email_pic: "ilham@company.com",
          },
        },
      ];
      setProposals(mockData);
      setFilteredProposals(mockData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    fetchPICList();
  }, []);

  // Filter and sort proposals
  useEffect(() => {
    let filtered = [...proposals];

    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.nama_proposal
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proposal.asal_proposal
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proposal.PIC?.nama_pic
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proposal.case_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.detail_produk
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (proposal) => proposal.status_pengambilan === statusFilter
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "tanggal") {
        aValue = new Date(a.tanggal_masuk);
        bValue = new Date(b.tanggal_masuk);
      } else if (sortBy === "pic") {
        aValue = a.PIC?.nama_pic || "";
        bValue = b.PIC?.nama_pic || "";
      } else if (sortBy === "nama") {
        aValue = a.nama_proposal || "";
        bValue = b.nama_proposal || "";
      } else if (sortBy === "total_harga") {
        aValue = Number.parseFloat(a.total_harga || 0);
        bValue = Number.parseFloat(b.total_harga || 0);
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProposals(filtered);
  }, [proposals, searchTerm, statusFilter, sortBy, sortOrder]);

  // Calculate summary data
  const totalProposals = proposals.length;
  const inProgressCount = proposals.filter(
    (p) => p.status_pengambilan === "In Progress"
  ).length;
  const readyCount = proposals.filter(
    (p) => p.status_pengambilan === "Siap Diambil"
  ).length;
  const doneCount = proposals.filter(
    (p) => p.status_pengambilan === "Done"
  ).length;
  const totalBudget = proposals.reduce(
    (sum, p) => sum + Number.parseFloat(p.total_harga || 0),
    0
  );

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Generate Case ID
  const generateCaseId = () => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `CSR-${currentYear}-${randomNum}`;
  };

  // Handle add new proposal
  const handleAddNew = () => {
    setModalMode("add");
    setFormData({
      case_id: generateCaseId(),
      nama: "",
      asal: "",
      status: "In Progress",
      pic_id: "",
      tanggal: new Date().toISOString().split("T")[0],
      bentuk_donasi: "",
      jumlah_produk: "",
      tipe_proposal: "",
      detail_produk: "",
      total_harga: "",
      catatan: "",
      file_pendukung: null,
    });
    setShowModal(true);
  };

  // Handle edit proposal
  const handleEdit = (proposal) => {
    setModalMode("edit");
    setCurrentProposal(proposal);
    setFormData({
      case_id: proposal.case_id || "",
      nama: proposal.nama_proposal || "",
      asal: proposal.asal_proposal || "",
      status: proposal.status_pengambilan || "In Progress",
      pic_id: proposal.id_pic || "",
      tanggal: proposal.tanggal_masuk?.split("T")[0] || "",
      bentuk_donasi: proposal.bentuk_donasi || "",
      jumlah_produk: proposal.jumlah_produk || "",
      tipe_proposal: proposal.tipe_proposal || "",
      detail_produk: proposal.detail_produk || "",
      total_harga: proposal.total_harga || "",
      catatan: proposal.catatan || "",
      file_pendukung: null,
    });
    setShowModal(true);
  };

  // Handle delete proposal
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proposal ini?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchProposals();
        } else {
          alert("Gagal menghapus proposal");
        }
      } catch (error) {
        console.error("Error deleting proposal:", error);
        alert("Terjadi kesalahan saat menghapus proposal");
      }
    }
  };

  // Handle form submission with file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append("case_id", formData.case_id);
      formDataToSend.append("nama_proposal", formData.nama);
      formDataToSend.append("asal_proposal", formData.asal);
      formDataToSend.append("status_pengambilan", formData.status);
      formDataToSend.append("tanggal_masuk", formData.tanggal);
      formDataToSend.append("bentuk_donasi", formData.bentuk_donasi);
      formDataToSend.append("jumlah_produk", formData.jumlah_produk);
      formDataToSend.append("tipe_proposal", formData.tipe_proposal);
      formDataToSend.append("detail_produk", formData.detail_produk);
      formDataToSend.append("total_harga", formData.total_harga);
      formDataToSend.append("catatan", formData.catatan);
      formDataToSend.append("id_pic", formData.pic_id || 1);

      // Add file if exists
      if (formData.file_pendukung) {
        formDataToSend.append("file_pendukung", formData.file_pendukung);
      }

      const url =
        modalMode === "add"
          ? `${API_BASE_URL}/proposals`
          : `${API_BASE_URL}/proposals/${currentProposal.id_proposal}`;

      const method = modalMode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (response.ok) {
        setShowModal(false);
        await fetchProposals();
      } else {
        const errorData = await response.json();
        alert(
          `Gagal ${modalMode === "add" ? "menambah" : "mengubah"} proposal: ${
            errorData.message
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "In Progress": "status-progress",
      "Siap Diambil": "status-ready",
      Done: "status-done",
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>{status}</span>
    );
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Sedang memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard - Sistem Monitoring CSR</h1>
        </div>
        <div className="user-info">
          <span>Welcome, Admin</span>
          <div className="user-avatar">A</div>
        </div>
      </header>

      {/* Show error if exists */}
      {error && (
        <div className="error-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
          </svg>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-card total">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>TOTAL PROPOSALS</h3>
            <p className="card-number">{totalProposals}</p>
          </div>
        </div>

        <div className="summary-card progress">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>IN PROGRESS</h3>
            <p className="card-number">{inProgressCount}</p>
          </div>
        </div>

        <div className="summary-card ready">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>SIAP DIAMBIL</h3>
            <p className="card-number">{readyCount}</p>
          </div>
        </div>

        <div className="summary-card done">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>DONE</h3>
            <p className="card-number">{doneCount}</p>
          </div>
        </div>

        <div className="summary-card budget">
          <div className="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
            </svg>
          </div>
          <div className="card-content">
            <h3>TOTAL BUDGET</h3>
            <p className="card-number budget-amount">
              {formatCurrency(totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <button className="add-button" onClick={handleAddNew}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Tambah Proposal Baru
        </button>

        <div className="filters">
          <div className="search-box">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Cari proposal, PIC, atau produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Siap Diambil">Siap Diambil</option>
            <option value="Done">Done</option>
          </select>

          <select
            className="sort-filter"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split("-");
              setSortBy(key);
              setSortOrder(order);
            }}
          >
            <option value="tanggal-desc">Terbaru</option>
            <option value="tanggal-asc">Terlama</option>
            <option value="nama-asc">Nama A-Z</option>
            <option value="nama-desc">Nama Z-A</option>
            <option value="total_harga-desc">Budget Tertinggi</option>
            <option value="total_harga-asc">Budget Terendah</option>
            <option value="status_pengambilan-asc">Status A-Z</option>
            <option value="pic-asc">PIC A-Z</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <h2>Daftar Proposal</h2>
          <span className="table-count">
            {filteredProposals.length} proposal ditemukan
          </span>
        </div>

        <div className="table-container">
          <table className="proposals-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("case_id")} className="sortable">
                  CASE ID
                  {sortBy === "case_id" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("nama")} className="sortable">
                  NAMA PROPOSAL
                  {sortBy === "nama" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>ASAL</th>
                <th>DETAIL PRODUK</th>
                <th
                  onClick={() => handleSort("total_harga")}
                  className="sortable"
                >
                  BUDGET
                  {sortBy === "total_harga" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  onClick={() => handleSort("status_pengambilan")}
                  className="sortable"
                >
                  STATUS
                  {sortBy === "status_pengambilan" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("pic")} className="sortable">
                  PIC
                  {sortBy === "pic" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort("tanggal")} className="sortable">
                  TANGGAL
                  {sortBy === "tanggal" && (
                    <span className="sort-indicator">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>FILE</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.id_proposal}>
                    <td className="case-id">{proposal.case_id}</td>
                    <td className="proposal-name">{proposal.nama_proposal}</td>
                    <td>{proposal.asal_proposal}</td>
                    <td className="product-detail">
                      <div className="product-info">
                        <span className="product-name">
                          {proposal.detail_produk || proposal.bentuk_donasi}
                        </span>
                        <small className="product-qty">
                          {proposal.jumlah_produk}
                        </small>
                      </div>
                    </td>
                    <td className="budget">
                      {formatCurrency(proposal.total_harga)}
                    </td>
                    <td>{getStatusBadge(proposal.status_pengambilan)}</td>
                    <td>
                      <div className="pic-info">
                        <span className="pic-name">
                          {proposal.PIC?.nama_pic || "Tidak ada"}
                        </span>
                        <small className="pic-email">
                          {proposal.PIC?.email_pic}
                        </small>
                      </div>
                    </td>
                    <td>
                      {proposal.tanggal_masuk
                        ? new Date(proposal.tanggal_masuk).toLocaleDateString(
                            "id-ID"
                          )
                        : "Tidak ada"}
                    </td>
                    <td>
                      {proposal.file_pendukung && (
                        <a
                          href={`/uploads/${proposal.file_pendukung}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-link"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                          File
                        </a>
                      )}
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(proposal)}
                        title="Edit Proposal"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(proposal.id_proposal)}
                        title="Hapus Proposal"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    Tidak ada proposal yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content enhanced-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {modalMode === "add" ? "Tambah Proposal Baru" : "Edit Proposal"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form enhanced-form">
              {/* Basic Information */}
              <div className="form-section">
                <h4>Informasi Dasar</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Case ID *</label>
                    <input
                      type="text"
                      name="case_id"
                      value={formData.case_id}
                      onChange={handleFormChange}
                      placeholder="CSR-2025-001"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Masuk *</label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nama Proposal *</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleFormChange}
                      placeholder="Program Bantuan Air Bersih Desa"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Asal Proposal *</label>
                    <input
                      type="text"
                      name="asal"
                      value={formData.asal}
                      onChange={handleFormChange}
                      placeholder="Kepala Desa / Organisasi"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>PIC (Person in Charge) *</label>
                    <select
                      name="pic_id"
                      value={formData.pic_id}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Pilih PIC</option>
                      {picList.map((pic) => (
                        <option key={pic.id_pic} value={pic.id_pic}>
                          {pic.nama_pic} - {pic.email_pic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Siap Diambil">Siap Diambil</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="form-section">
                <h4>Informasi Produk</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bentuk Donasi</label>
                    <input
                      type="text"
                      name="bentuk_donasi"
                      value={formData.bentuk_donasi}
                      onChange={handleFormChange}
                      placeholder="Air Mineral, Sembako, Peralatan Sekolah"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipe Proposal</label>
                    <select
                      name="tipe_proposal"
                      value={formData.tipe_proposal}
                      onChange={handleFormChange}
                    >
                      <option value="">Pilih tipe</option>
                      <option value="Sekali Jalan">Sekali Jalan</option>
                      <option value="Berkelanjutan">Berkelanjutan</option>
                      <option value="Tahunan">Tahunan</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Detail Produk</label>
                  <textarea
                    name="detail_produk"
                    value={formData.detail_produk}
                    onChange={handleFormChange}
                    placeholder="Contoh: Air mineral kemasan 600ml merk Aqua, total 100 dus berisi 24 botol per dus"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Jumlah Produk</label>
                    <input
                      type="text"
                      name="jumlah_produk"
                      value={formData.jumlah_produk}
                      onChange={handleFormChange}
                      placeholder="100 dus @ 24 botol = 2400 botol"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Harga (IDR)</label>
                    <input
                      type="number"
                      name="total_harga"
                      value={formData.total_harga}
                      onChange={handleFormChange}
                      placeholder="5000000"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <h4>Informasi Tambahan</h4>
                <div className="form-group">
                  <label>Catatan</label>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleFormChange}
                    placeholder="Catatan khusus, kondisi khusus, atau informasi tambahan lainnya"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>File Pendukung</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      name="file_pendukung"
                      onChange={handleFormChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="file-input"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      <span>
                        {formData.file_pendukung
                          ? formData.file_pendukung.name
                          : "Pilih file atau drag & drop"}
                      </span>
                      <small>PDF, DOC, DOCX, JPG, PNG (Max 5MB)</small>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-cancel"
                >
                  Batal
                </button>
                <button type="submit" className="btn-submit">
                  {modalMode === "add" ? "Tambah Proposal" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPages;
