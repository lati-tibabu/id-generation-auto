import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus({ type: '', message: '' });
    setResults(null);
  };

  const getExpiryDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + 2);
    return date.toISOString().split('T')[0];
  };

  // Placeholder base64 for photo (a tiny gray pixel or similar)
  const placeholderPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a CSV file first.' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Parsing and uploading...' });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const columnMap = {
          full_name_en: headers.indexOf('full_name_en'),
          full_name_am: headers.indexOf('full_name_am'),
          role_en: headers.indexOf('role_en'),
          role_am: headers.indexOf('role_am'),
          id_no: headers.indexOf('id_no'),
          phone_no: headers.indexOf('phone_no')
        };

        // Validate headers
        const missingHeaders = Object.keys(columnMap).filter(key => columnMap[key] === -1);
        if (missingHeaders.length > 0) {
          throw new Error(`Missing headers: ${missingHeaders.join(', ')}`);
        }

        const today = new Date().toISOString().split('T')[0];
        const expiry = getExpiryDate(today);

        const employees = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim());
          if (values.length < headers.length) continue;

          employees.push({
            fullNameEn: values[columnMap.full_name_en],
            fullNameLocal: values[columnMap.full_name_am],
            positionTitleEn: values[columnMap.role_en],
            positionTitleLocal: values[columnMap.role_am],
            idNumber: values[columnMap.id_no],
            phone: values[columnMap.phone_no],
            issueDate: today,
            expiryDate: expiry,
            photo: placeholderPhoto
          });
        }

        if (employees.length === 0) {
          throw new Error('No valid employee data found in CSV.');
        }

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/employees/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(employees)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to upload employees');
        }

        setStatus({ type: 'success', message: `Successfully imported ${employees.length} employees!` });
        setResults(employees.length);
        setFile(null);
      } catch (err) {
        setStatus({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setStatus({ type: 'error', message: 'Failed to read file.' });
      setLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '12px' }}>
            <FileText size={24} color="#2563eb" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Bulk ID Generation</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Upload a CSV file to generate multiple IDs at once.</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '12px' }}>CSV Format Requirements</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Your CSV file must include the following headers exactly:</p>
          <code style={{ display: 'block', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#0f172a' }}>
            full_name_en,full_name_am,role_en,role_am,id_no,phone_no
          </code>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ 
            border: '2px dashed #cbd5e1', 
            borderRadius: '16px', 
            padding: '40px', 
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: file ? '#f0f9ff' : 'transparent',
            borderColor: file ? '#3b82f6' : '#cbd5e1'
          }}
          onClick={() => document.getElementById('csv-upload').click()}
          >
            <input 
              id="csv-upload"
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Upload size={40} color={file ? '#2563eb' : '#94a3b8'} style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>
              {file ? file.name : 'Click to upload your CSV file'}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Only .csv files are supported</p>
          </div>

          {status.message && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              backgroundColor: status.type === 'error' ? '#fef2f2' : (status.type === 'success' ? '#f0fdf4' : '#eff6ff'),
              color: status.type === 'error' ? '#991b1b' : (status.type === 'success' ? '#166534' : '#1e40af'),
              fontSize: '14px'
            }}>
              {status.type === 'error' ? <AlertCircle size={20} /> : (status.type === 'success' ? <CheckCircle2 size={20} /> : <div className="animate-spin"><RefreshCcw size={20} /></div>)}
              {status.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !file}
            style={{ 
              width: '100%',
              marginTop: '32px',
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '16px', 
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              opacity: loading || !file ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Processing...' : 'Start Bulk Import'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BulkUpload;