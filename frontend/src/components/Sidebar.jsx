import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    try {
      const user = localStorage.getItem('admin_user');
      if (user) {
        setUserInfo(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      setUserInfo({ username: 'Admin', role: 'Administrator' });
    }
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ),
      path: "/dashboard",
      active: location.pathname === "/dashboard" || location.pathname === "/"
    },
    {
      id: "proposals",
      label: "Kelola Proposal",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.1 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
        </svg>
      ),
      path: "/proposals",
      active: location.pathname.startsWith("/proposals"),
      submenu: [
        { label: "Semua Proposal", path: "/proposals" },
        { label: "In Progress", path: "/proposals?status=progress" },
        { label: "Siap Diambil", path: "/proposals?status=ready" },
        { label: "Selesai", path: "/proposals?status=done" }
      ]
    },
    {
      id: "admin",
      label: "Kelola Admin",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2m4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 16.5 6H15c-.8 0-1.5.7-1.5 1.5v2.34c-.73.39-1.36 1.01-1.78 1.75L6 14.25V16.5L12 19v-2.25l-3.07-1.09L9.5 15H12v5h8M12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5"/>
        </svg>
      ),
      path: "/admin",
      active: location.pathname.startsWith("/admin"),
      submenu: [
        { label: "Daftar Admin", path: "/admin/users" },
        { label: "Tambah Admin", path: "/admin/add" },
        { label: "Role & Permissions", path: "/admin/roles" }
      ]
    },
    {
      id: "pic",
      label: "Kelola PIC",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      path: "/pic",
      active: location.pathname.startsWith("/pic"),
      submenu: [
        { label: "Daftar PIC", path: "/pic" },
        { label: "Tambah PIC", path: "/pic/add" }
      ]
    },
    {
      id: "reports",
      label: "Laporan",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      path: "/reports",
      active: location.pathname.startsWith("/reports"),
      submenu: [
        { label: "Laporan Bulanan", path: "/reports/monthly" },
        { label: "Laporan Tahunan", path: "/reports/yearly" },
        { label: "Export Data", path: "/reports/export" }
      ]
    },
    {
      id: "settings",
      label: "Pengaturan",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
      ),
      path: "/settings",
      active: location.pathname.startsWith("/settings"),
      submenu: [
        { label: "Pengaturan Umum", path: "/settings/general" },
        { label: "Notifikasi", path: "/settings/notifications" },
        { label: "Backup Data", path: "/settings/backup" }
      ]
    }
  ];

  const handleMenuClick = (item) => {
    if (item.submenu) {
      // Toggle submenu
      setExpandedMenus(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    } else {
      // Navigate to page
      try {
        navigate(item.path);
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = item.path; // Fallback
      }
    }
  };

  const handleSubmenuClick = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path; // Fallback
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/login"; // Gunakan window.location untuk avoid hook issues
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
          </svg>
          {!collapsed && (
            <div className="logo-text">
              <h3>CSR Monitor</h3>
              <span>Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${item.active ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.submenu && (
                      <span className={`nav-arrow ${expandedMenus[item.id] ? 'expanded' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                        </svg>
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {!collapsed && item.submenu && expandedMenus[item.id] && (
                <ul className="submenu">
                  {item.submenu.map((subitem, index) => (
                    <li key={index}>
                      <button
                        className={`submenu-link ${location.pathname === subitem.path ? 'active' : ''}`}
                        onClick={() => handleSubmenuClick(subitem.path)}
                      >
                        {subitem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="sidebar-footer">
        {!collapsed && userInfo && (
          <div className="user-profile">
            <div className="user-avatar-small">
              {(userInfo.username?.charAt(0) || 'A').toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{userInfo.username || 'Admin'}</span>
              <span className="user-role">{userInfo.role || 'Administrator'}</span>
            </div>
          </div>
        )}
        
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;