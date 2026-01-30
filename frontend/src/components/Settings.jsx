import React, { useState } from 'react';
import { Shield, Key, CheckCircle2, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match' });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');

      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: '40px',
    maxWidth: '800px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    marginTop: '8px',
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>Settings</h1>
        <p style={{ color: '#64748b' }}>Manage your account security and preferences.</p>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Shield style={{ color: '#2563eb' }} size={24} />
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Security Settings</h2>
        </div>

        {status.message && (
          <div style={{ 
            padding: '16px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: status.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fee2e2'}`
          }}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '400px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Current Password</label>
              <input 
                type="password" 
                style={inputStyle}
                required
                value={formData.oldPassword}
                onChange={e => setFormData({...formData, oldPassword: e.target.value})}
              />
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>New Password</label>
              <input 
                type="password" 
                style={inputStyle}
                required
                value={formData.newPassword}
                onChange={e => setFormData({...formData, newPassword: e.target.value})}
              />
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Confirm New Password</label>
              <input 
                type="password" 
                style={inputStyle}
                required
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" style={buttonStyle} disabled={loading}>
            <Key size={18} />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
