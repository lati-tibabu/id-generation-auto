import React, { useState, useEffect } from 'react';
import { User, CreditCard, Phone, Calendar, Upload, Loader2 } from 'lucide-react';
import { removeBackground, preload } from "@imgly/background-removal";

const IDForm = ({ onFormChange, onSave }) => {
  useEffect(() => {
    // Preload models as soon as the component mounts
    preload({ model: 'isnet_quint8' }).catch(err => console.error("Preload failed:", err));
  }, []);

  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [formData, setFormData] = useState({
    fullNameEn: '',
    fullNameLocal: '',
    positionTitleEn: '',
    positionTitleLocal: '',
    idNumber: '',
    phone: '',
    issueDate: '',
    expiryDate: '',
    photo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onFormChange(updatedData);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsRemovingBackground(true);
      console.log("Starting background removal for:", file.name);
      console.log("SharedArrayBuffer available:", typeof SharedArrayBuffer !== 'undefined');
      console.log("Cross-origin isolated:", window.crossOriginIsolated);
      try {
        const config = {
          debug: true,
          model: 'isnet_quint8',
          output: {
            format: 'image/png',
            quality: 0.8,
            type: 'foreground'
          },
          progress: (key, current, total) => {
            console.log(`Downloading ${key}: ${Math.round(current/total*100)}%`);
          }
        };
        const blob = await removeBackground(file, config);
        console.log("Background removal successful, blob size:", blob.size);
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedData = { ...formData, photo: reader.result };
          setFormData(updatedData);
          onFormChange(updatedData);
          setIsRemovingBackground(false);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Background removal failed:", error);
        alert("Background removal failed. Using original image. Check console for details.");
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedData = { ...formData, photo: reader.result };
          setFormData(updatedData);
          onFormChange(updatedData);
          setIsRemovingBackground(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const inputGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#1e293b' }}>Employee Information</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Full Name (English)</label>
          <input type="text" name="fullNameEn" value={formData.fullNameEn} onChange={handleChange} style={inputStyle} placeholder="John Doe" />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Full Name (Local)</label>
          <input type="text" name="fullNameLocal" value={formData.fullNameLocal} onChange={handleChange} style={inputStyle} placeholder="???? ??" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Position (English)</label>
          <input type="text" name="positionTitleEn" value={formData.positionTitleEn} onChange={handleChange} style={inputStyle} placeholder="Software Engineer" />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Position (Local)</label>
          <input type="text" name="positionTitleLocal" value={formData.positionTitleLocal} onChange={handleChange} style={inputStyle} placeholder="????? ???????" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>ID Number</label>
          <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} style={inputStyle} placeholder="EMP-123456" />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} placeholder="+123 456 789" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Issue Date</label>
          <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Expiry Date</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Profile Photo</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f1f5f9', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#475569',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Upload size={18} />
            {isRemovingBackground ? 'Processing...' : 'Choose Photo'}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={isRemovingBackground} />
          </label>
          {isRemovingBackground && <Loader2 size={18} className="animate-spin" style={{ color: '#2563eb' }} />}
          {formData.photo && !isRemovingBackground && <span style={{ fontSize: '12px', color: '#10b981' }}> Photo uploaded</span>}
        </div>
      </div>

      <button 
        disabled={isRemovingBackground}
        onClick={() => onSave(formData)} 
        style={{ 
          width: '100%', 
          padding: '14px', 
          backgroundColor: isRemovingBackground ? '#94a3b8' : '#2563eb', 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px', 
          fontSize: '16px', 
          fontWeight: '700', 
          cursor: isRemovingBackground ? 'not-allowed' : 'pointer',
          marginTop: '10px',
          boxShadow: isRemovingBackground ? 'none' : '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
        }}
      >
        {isRemovingBackground ? 'Processing Photo...' : 'Generate & Save ID Card'}
      </button>
    </div>
  );
};

export default IDForm;
