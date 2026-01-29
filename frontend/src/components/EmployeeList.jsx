import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2
} from 'lucide-react';
import IDTemplate from './id_template';
import { removeBackground, preload } from "@imgly/background-removal";

const EmployeeList = ({ setActiveTab }) => {
  useEffect(() => {
    preload({ model: 'isnet_quint8' }).catch(err => console.error("Preload failed:", err));
  }, []);

  const [employees, setEmployees] = useState([]);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      fullNameEn: employee.fullNameEn,
      fullNameLocal: employee.fullNameLocal,
      positionTitleEn: employee.positionTitleEn,
      positionTitleLocal: employee.positionTitleLocal,
      idNumber: employee.idNumber,
      phone: employee.phone,
      issueDate: employee.issueDate.split('T')[0],
      expiryDate: employee.expiryDate.split('T')[0],
      photo: employee.photo,
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleDeleteClick = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch('http://localhost:5000/api/employees/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to delete');
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        alert('Error deleting employee: ' + err.message);
      }
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/employees/' + editingEmployee.id, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Failed to update employee');
      const updatedEmployee = await response.json();
      setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
      setEditingEmployee(null);
    } catch (error) {
      alert('Error updating employee: ' + error.message);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} employees?`)) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/employees/bulk', {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (!response.ok) throw new Error('Failed to delete selected employees');
        setEmployees(employees.filter(emp => !selectedIds.includes(emp.id)));
        setSelectedIds([]);
      } catch (err) {
        alert('Error deleting employees: ' + err.message);
      }
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.positionTitleEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerStyle = {
    padding: '32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '24px',
  };

  const searchContainerStyle = {
    position: 'relative',
    flex: 1,
    maxWidth: '500px',
  };

  const searchInputStyle = {
    width: '100%',
    padding: '12px 16px 12px 48px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const tableContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  };

  const thStyle = {
    padding: '16px 24px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14px',
    color: '#334155',
    verticalAlign: 'middle',
  };

  if (loading) return <div style={containerStyle}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={searchContainerStyle}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
          <input 
            type="text" 
            placeholder="Search employees by name, ID, or position..." 
            style={searchInputStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <Bell size={24} />
          </button>
          <button style={actionButtonStyle} onClick={() => setActiveTab && setActiveTab('generate')}>
            <Plus size={20} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Employee Directory</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Manage and view all registered employee records in the system.</p>
      </div>

      {editingEmployee ? (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginBottom: '24px' }}>Edit Employee</h2>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input required placeholder="Name (EN)" value={editFormData.fullNameEn} onChange={e => setEditFormData({...editFormData, fullNameEn: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
                <input required placeholder="Name (Local)" value={editFormData.fullNameLocal} onChange={e => setEditFormData({...editFormData, fullNameLocal: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input required placeholder="Position (EN)" value={editFormData.positionTitleEn} onChange={e => setEditFormData({...editFormData, positionTitleEn: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
                <input required placeholder="Position (Local)" value={editFormData.positionTitleLocal} onChange={e => setEditFormData({...editFormData, positionTitleLocal: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input required placeholder="ID Number" value={editFormData.idNumber} onChange={e => setEditFormData({...editFormData, idNumber: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
                <input required placeholder="Phone Number" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Update Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   {isRemovingBackground ? (
                      <div style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Loader2 size={24} className="animate-spin" style={{ color: '#2563eb' }} />
                      </div>
                   ) : (
                      <img src={editFormData.photo} alt="Current" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                   )}
                   <input type="file" accept="image/*" disabled={isRemovingBackground} onChange={async (e) => {
                      if (e.target.files[0]) {
                         setIsRemovingBackground(true);
                         console.log("Updating photo, removing background for:", e.target.files[0].name);
                         console.log("SharedArrayBuffer available:", typeof SharedArrayBuffer !== 'undefined');
                         console.log("Cross-origin isolated:", window.crossOriginIsolated);
                         try {
                            const config = {
                               debug: true,
                               model: 'isnet_quint8',
                               progress: (key, current, total) => {
                                  console.log(`Downloading ${key}: ${Math.round(current/total*100)}%`);
                               }
                            };
                            const blob = await removeBackground(e.target.files[0], config);
                            console.log("Background removal successful, blob size:", blob.size);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                               setEditFormData({...editFormData, photo: reader.result});
                               setIsRemovingBackground(false);
                            };
                            reader.readAsDataURL(blob);
                         } catch (error) {
                            console.error("Background removal failed:", error);
                            alert("Background removal failed. Using original image.");
                            const base64 = await convertFileToBase64(e.target.files[0]);
                            setEditFormData({...editFormData, photo: base64});
                            setIsRemovingBackground(false);
                         }
                      }
                   }} style={{ fontSize: '14px' }} />
                </div>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Issue Date</label>
                  <input type="date" value={editFormData.issueDate} onChange={e => setEditFormData({...editFormData, issueDate: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>Expiry Date</label>
                  <input type="date" value={editFormData.expiryDate} onChange={e => setEditFormData({...editFormData, expiryDate: e.target.value})} style={{ ...searchInputStyle, paddingLeft: '16px' }} />
                </div>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" disabled={isRemovingBackground} style={{ ...actionButtonStyle, backgroundColor: isRemovingBackground ? '#94a3b8' : actionButtonStyle.backgroundColor }}>
                   {isRemovingBackground ? 'Processing...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditingEmployee(null)} style={{ ...actionButtonStyle, backgroundColor: '#64748b' }}>Cancel</button>
             </div>
          </form>
        </div>
      ) : selectedEmployee ? (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button onClick={() => setSelectedEmployee(null)} style={{ alignSelf: 'flex-start', marginBottom: '20px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}> Back to list</button>
          <IDTemplate {...selectedEmployee} />
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Registered Employees ({filteredEmployees.length})</h3>
                {selectedIds.length > 0 && (
                  <button 
                    onClick={handleBulkDelete}
                    style={{ 
                      ...actionButtonStyle, 
                      backgroundColor: '#ef4444', 
                      padding: '8px 16px',
                      fontSize: '13px'
                    }}
                  >
                    Delete Selected ({selectedIds.length})
                  </button>
                )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Filter size={18} style={{ color: '#64748b', cursor: 'pointer' }} />
              <Download size={18} style={{ color: '#64748b', cursor: 'pointer' }} />
            </div>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
                  />
                </th>
                <th style={thStyle}>Photo</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>ID Number</th>
                <th style={thStyle}>Position</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Issue Date</th>
                <th style={thStyle}>Expiry Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: selectedIds.includes(emp.id) ? '#f8fafc' : 'transparent' }}>
                  <td style={{ ...tdStyle, width: '40px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(emp.id)}
                      onChange={() => handleSelectOne(emp.id)}
                    />
                  </td>
                  <td style={tdStyle}>
                    <img src={emp.photo} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#2563eb', fontWeight: '600' }}>{emp.fullNameEn}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.fullNameLocal}</div>
                  </td>
                  <td style={tdStyle}>{emp.idNumber}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '500' }}>{emp.positionTitleEn}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{emp.positionTitleLocal}</div>
                  </td>
                  <td style={tdStyle}>{emp.phone}</td>
                  <td style={tdStyle}>{new Date(emp.issueDate).toLocaleDateString()}</td>
                  <td style={tdStyle}>{new Date(emp.expiryDate).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}>
                      <Eye size={18} style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(emp)} />
                      <Edit2 size={18} style={{ cursor: 'pointer' }} onClick={() => handleEditClick(emp)} />
                      <Trash2 size={18} style={{ cursor: 'pointer', color: '#ef4444' }} onClick={() => handleDeleteClick(emp.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfcfc' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Showing 1 to {filteredEmployees.length} of {filteredEmployees.length} entries</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#94a3b8' }}>Previous</button>
              <button style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#2563eb', color: 'white', border: 'none' }}>1</button>
              <button disabled style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#94a3b8' }}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
