import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EmployeeList from './components/EmployeeList';
import IDTemplate from './components/id_template';
import Login from './components/Login';
import Settings from './components/Settings';
import BulkUpload from './components/BulkUpload';

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getExpiryDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + 2);
    return date.toISOString().split('T')[0];
  };

  const initialDate = getTodayDate();
  const initialExpiry = getExpiryDate(initialDate);

  const [formData, setFormData] = useState({
    fullNameEn: '',
    fullNameLocal: '',
    positionTitleEn: '',
    positionTitleLocal: '',
    idNumber: '',
    phone: '',
    issueDate: initialDate,
    expiryDate: initialExpiry,
    photo: null,
  });

  const [employeeData, setEmployeeData] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => {
            if (!res.ok) handleLogout();
        }).catch(() => handleLogout());
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    setIsSubmitted(false);
    
    setFormData((prev) => {
      let newValue = type === 'file' ? files[0] : value;
      if (name === 'phone') {
        newValue = value.replace(/\s+/g, '').replace(/[^\d+]/g, '');
        if (newValue.startsWith('+251')) newValue = '0' + newValue.slice(4);
        else if (newValue.startsWith('251') && newValue.length > 9) newValue = '0' + newValue.slice(3);
        if (newValue.length === 9 && (newValue.startsWith('9') || newValue.startsWith('7'))) newValue = '0' + newValue;
        if (newValue.length > 0) {
          const isValid = /^0[79]\d{8}$/.test(newValue);
          if (newValue.length === 10 && !isValid) setPhoneError('Starting digit should be 09... or 07...');
          else if (newValue.length > 10) setPhoneError('Phone number is too long');
          else if (newValue.length > 0 && newValue.length < 10) setPhoneError('Phone number should be 10 digits');
          else setPhoneError('');
        } else setPhoneError('');
      }
      const newState = { ...prev, [name]: newValue };
      if (name === 'issueDate') newState.expiryDate = getExpiryDate(value);
      return newState;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return handleLogout();

    const requiredFields = ['fullNameEn', 'fullNameLocal', 'positionTitleEn', 'positionTitleLocal', 'idNumber', 'phone', 'issueDate', 'expiryDate', 'photo'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert('Please fill in all fields before generating the ID.');
      return;
    }
    if (phoneError) {
      alert('Please fix the phone number error first.');
      return;
    }
    setSaving(true);
    try {
      const photoBase64 = await convertFileToBase64(formData.photo);
      const employeeDataToSave = { ...formData, photo: photoBase64 };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeDataToSave),
      });
      if (!response.ok) {
          if (response.status === 401) return handleLogout();
          throw new Error('Failed to save employee');
      }
      setEmployeeData({ ...formData, photo: photoBase64 });
      setIsSubmitted(true);
      alert('Employee saved successfully!');
    } catch (error) {
      alert('Error saving employee: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const mainStyles = {
    flex: 1,
    marginLeft: '260px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    color: '#1e293b',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main style={mainStyles}>
        {activeTab === 'dashboard' && (
          <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: '#64748b' }}>Welcome to OTech ID Management System</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginTop: '32px' }}>
              {[
                { label: 'Total Employees', value: '...', color: '#2563eb' },
                { label: 'IDs Generated', value: '...', color: '#059669' },
                { label: 'Pending Expiry', value: '0', color: '#d97706' },
              ].map(stat => (
                <div key={stat.label} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>{stat.label}</span>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, marginTop: '8px' }}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div style={{ padding: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
               <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>Generate ID</h1>
               <p style={{ color: '#64748b', marginTop: '4px' }}>Create professional identity cards instantly.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Employee Details</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Full Name (EN)</label>
                        <input required type="text" name="fullNameEn" value={formData.fullNameEn} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Full Name (Local)</label>
                        <input required type="text" name="fullNameLocal" value={formData.fullNameLocal} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                      </div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Position (EN)</label>
                         <input required type="text" name="positionTitleEn" value={formData.positionTitleEn} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Position (Local)</label>
                         <input required type="text" name="positionTitleLocal" value={formData.positionTitleLocal} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                      </div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>ID Number</label>
                         <input required type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Phone</label>
                         <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid ' + (phoneError ? '#ef4444' : '#e2e8f0'), fontSize: '14px', outline: 'none' }} />
                         {phoneError && <span style={{ color: '#ef4444', fontSize: '11px' }}>{phoneError}</span>}
                      </div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Issue Date</label>
                         <input required type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Expiry Date</label>
                         <input required type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }} />
                      </div>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Employee Photo</label>
                      <input required type="file" name="photo" accept="image/*" onChange={handleChange} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
                   </div>
                   <button type="submit" disabled={saving} style={{ backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s' }}>
                      {saving ? 'Saving...' : 'Generate & Save ID Card'}
                   </button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '380px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>Live Preview</h2>
                  <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
                    <IDTemplate {...(isSubmitted ? employeeData : formData)} photo={isSubmitted ? employeeData.photo : (formData.photo ? URL.createObjectURL(formData.photo) : null)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <EmployeeList setActiveTab={setActiveTab} />
        )}

        {activeTab === 'bulk' && (
          <BulkUpload />
        )}

        {activeTab === 'settings' && (
          <Settings />
        )}
      </main>
    </div>
  );
};

export default App;
