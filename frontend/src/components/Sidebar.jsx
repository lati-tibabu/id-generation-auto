import React from 'react';
import { 
  LayoutDashboard, 
  PlusSquare, 
  Users, 
  Settings as SettingsIcon, 
  LogOut,
  Moon,
  Files
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const sidebarStyle = {
    width: '260px',
    height: '100vh',
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    padding: '24px 16px',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
  };

  const logoStyle = {
    padding: '0 12px 32px',
    display: 'flex',
    flexDirection: 'column',
  };

  const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    margin: '4px 0',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontSize: '15px',
    fontWeight: '500',
    color: '#94a3b8',
    gap: '12px',
  };

  const activeMenuItemStyle = {
    ...menuItemStyle,
    backgroundColor: '#2563eb',
    color: '#ffffff',
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate ID', icon: PlusSquare },
    { id: 'bulk', label: 'Bulk ID Generation', icon: Files },
    { id: 'employees', label: 'Employee List', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const profileStyle = {
    marginTop: 'auto',
    padding: '16px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #1e293b',
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    backgroundColor: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>OTech ID</h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Management System</p>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              style={isActive ? activeMenuItemStyle : menuItemStyle}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </div>
          );
        })}
        
        <div
          style={{ ...menuItemStyle, marginTop: '20px', color: '#ef4444' }}
          onClick={onLogout}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#450a0a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </nav>

      <div style={profileStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={avatarStyle}>{user.username?.[0].toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{user.username}</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>{user.role}</span>
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
          <Moon size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
