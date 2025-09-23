// src/api/proposalService.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

class ProposalService {
  // Helper method untuk handle response
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  // Helper method untuk handle request dengan error handling
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`API Error (${options.method || "GET"} ${url}):`, error);
      throw error;
    }
  }

  // GET - Ambil semua proposals
  async getAllProposals() {
    return this.makeRequest("/api/proposals");
  }

  // GET - Ambil proposal berdasarkan ID
  async getProposalById(id) {
    return this.makeRequest(`/api/proposals/${id}`);
  }

  // POST - Tambah proposal baru
  async createProposal(proposalData) {
    // Validasi data sebelum dikirim
    const requiredFields = ["nama_proposal", "asal_proposal"];
    for (const field of requiredFields) {
      if (!proposalData[field]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    // Pastikan data sesuai dengan struktur database
    const formattedData = {
      nama_proposal: proposalData.nama_proposal,
      asal_proposal: proposalData.asal_proposal,
      tanggal_masuk: proposalData.tanggal_masuk || new Date().toISOString(),
      bentuk_donasi: proposalData.bentuk_donasi || null,
      status_approval: proposalData.status_approval || null,
      jumlah_produk: proposalData.jumlah_produk || null,
      tipe_proposal: proposalData.tipe_proposal || null,
      status_pengambilan: proposalData.status_pengambilan || "In Progress",
      id_pic: proposalData.id_pic || 1, // Default PIC ID
    };

    return this.makeRequest("/api/proposals", {
      method: "POST",
      body: JSON.stringify(formattedData),
    });
  }

  // PUT - Update proposal
  async updateProposal(id, proposalData) {
    // Validasi ID
    if (!id) {
      throw new Error("Proposal ID is required");
    }

    // Format data untuk update
    const formattedData = {
      nama_proposal: proposalData.nama_proposal,
      asal_proposal: proposalData.asal_proposal,
      tanggal_masuk: proposalData.tanggal_masuk,
      bentuk_donasi: proposalData.bentuk_donasi || null,
      status_approval: proposalData.status_approval || null,
      jumlah_produk: proposalData.jumlah_produk || null,
      tipe_proposal: proposalData.tipe_proposal || null,
      status_pengambilan: proposalData.status_pengambilan,
      id_pic: proposalData.id_pic || 1,
    };

    return this.makeRequest(`/api/proposals/${id}`, {
      method: "PUT",
      body: JSON.stringify(formattedData),
    });
  }

  // DELETE - Hapus proposal
  async deleteProposal(id) {
    if (!id) {
      throw new Error("Proposal ID is required");
    }

    return this.makeRequest(`/api/proposals/${id}`, {
      method: "DELETE",
    });
  }

  // GET - Statistik dashboard
  async getDashboardStats() {
    try {
      const proposals = await this.getAllProposals();

      return {
        total: proposals.length,
        inProgress: proposals.filter(
          (p) => p.status_pengambilan === "In Progress"
        ).length,
        ready: proposals.filter((p) => p.status_pengambilan === "Siap Diambil")
          .length,
        done: proposals.filter((p) => p.status_pengambilan === "Done").length,
        approved: proposals.filter((p) => p.status_approval === "Approved")
          .length,
        pending: proposals.filter(
          (p) => p.status_approval === null || p.status_approval === "Pending"
        ).length,
        rejected: proposals.filter((p) => p.status_approval === "Rejected")
          .length,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  // GET - Filter proposals berdasarkan kriteria
  async getFilteredProposals(filters = {}) {
    try {
      const proposals = await this.getAllProposals();
      let filtered = [...proposals];

      // Filter berdasarkan status pengambilan
      if (filters.status_pengambilan && filters.status_pengambilan !== "all") {
        filtered = filtered.filter(
          (p) => p.status_pengambilan === filters.status_pengambilan
        );
      }

      // Filter berdasarkan status approval
      if (filters.status_approval && filters.status_approval !== "all") {
        filtered = filtered.filter(
          (p) => p.status_approval === filters.status_approval
        );
      }

      // Filter berdasarkan tanggal range
      if (filters.startDate) {
        filtered = filtered.filter(
          (p) => new Date(p.tanggal_masuk) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        filtered = filtered.filter(
          (p) => new Date(p.tanggal_masuk) <= new Date(filters.endDate)
        );
      }

      // Filter berdasarkan search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.nama_proposal?.toLowerCase().includes(searchTerm) ||
            p.asal_proposal?.toLowerCase().includes(searchTerm) ||
            p.case_id?.toLowerCase().includes(searchTerm) ||
            p.bentuk_donasi?.toLowerCase().includes(searchTerm) ||
            p.PIC?.nama_pic?.toLowerCase().includes(searchTerm)
        );
      }

      // Sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          let aValue = a[filters.sortBy];
          let bValue = b[filters.sortBy];

          if (filters.sortBy === "tanggal_masuk") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          } else if (filters.sortBy === "pic") {
            aValue = a.PIC?.nama_pic || "";
            bValue = b.PIC?.nama_pic || "";
          } else if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (filters.sortOrder === "desc") {
            return aValue < bValue ? 1 : -1;
          } else {
            return aValue > bValue ? 1 : -1;
          }
        });
      }

      return filtered;
    } catch (error) {
      console.error("Error filtering proposals:", error);
      throw error;
    }
  }

  // GET - Search proposals
  async searchProposals(query) {
    if (!query) return this.getAllProposals();

    return this.getFilteredProposals({ search: query });
  }

  // PUT - Update status pengambilan
  async updateStatusPengambilan(id, status) {
    const validStatuses = ["In Progress", "Siap Diambil", "Done"];

    if (!validStatuses.includes(status)) {
      throw new Error(
        "Invalid status. Must be one of: " + validStatuses.join(", ")
      );
    }

    return this.makeRequest(`/api/proposals/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status_pengambilan: status }),
    });
  }

  // PUT - Update status approval
  async updateStatusApproval(id, status) {
    const validStatuses = ["Pending", "Approved", "Rejected"];

    if (!validStatuses.includes(status)) {
      throw new Error(
        "Invalid status. Must be one of: " + validStatuses.join(", ")
      );
    }

    return this.makeRequest(`/api/proposals/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status_approval: status }),
    });
  }

  // GET - Export data untuk laporan
  async exportProposals(format = "json", filters = {}) {
    try {
      const proposals = await this.getFilteredProposals(filters);

      if (format === "csv") {
        return this.convertToCSV(proposals);
      }

      return proposals;
    } catch (error) {
      console.error("Error exporting proposals:", error);
      throw error;
    }
  }

  // Helper method untuk convert ke CSV
  convertToCSV(proposals) {
    if (proposals.length === 0) return "";

    const headers = [
      "Case ID",
      "Nama Proposal",
      "Asal Proposal",
      "Tanggal Masuk",
      "Bentuk Donasi",
      "Jumlah Produk",
      "Tipe Proposal",
      "Status Pengambilan",
      "Status Approval",
      "PIC",
    ];

    const csvContent = [
      headers.join(","),
      ...proposals.map((proposal) =>
        [
          proposal.case_id || "",
          `"${proposal.nama_proposal || ""}"`,
          `"${proposal.asal_proposal || ""}"`,
          proposal.tanggal_masuk
            ? new Date(proposal.tanggal_masuk).toLocaleDateString("id-ID")
            : "",
          `"${proposal.bentuk_donasi || ""}"`,
          `"${proposal.jumlah_produk || ""}"`,
          `"${proposal.tipe_proposal || ""}"`,
          proposal.status_pengambilan || "",
          proposal.status_approval || "",
          `"${proposal.PIC?.nama_pic || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    return csvContent;
  }

  // Method untuk download CSV
  downloadCSV(proposals, filename = "proposals.csv") {
    const csvContent = this.convertToCSV(proposals);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Bulk operations
  async bulkUpdateStatus(ids, status) {
    const promises = ids.map((id) => this.updateStatusPengambilan(id, status));
    return Promise.allSettled(promises);
  }

  async bulkDelete(ids) {
    const promises = ids.map((id) => this.deleteProposal(id));
    return Promise.allSettled(promises);
  }

  // Validation helpers
  validateProposalData(data) {
    const errors = [];

    if (!data.nama_proposal || data.nama_proposal.trim().length < 3) {
      errors.push("Nama proposal minimal 3 karakter");
    }

    if (!data.asal_proposal || data.asal_proposal.trim().length < 3) {
      errors.push("Asal proposal minimal 3 karakter");
    }

    if (data.tanggal_masuk && new Date(data.tanggal_masuk) > new Date()) {
      errors.push("Tanggal masuk tidak boleh lebih dari hari ini");
    }

    if (
      data.jumlah_produk &&
      isNaN(parseInt(data.jumlah_produk.split(" ")[0]))
    ) {
      // Validasi sederhana untuk format jumlah produk
      console.warn("Format jumlah produk mungkin tidak valid");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Create dan export instance
const proposalService = new ProposalService();
export default proposalService;
