import React, { useState } from 'react';
import IDTemplate from './components/id_template';

const App = () => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getExpiryDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + 2);
    return date.toISOString().split('T')[0];
  };

  const initialDate = getTodayDate();
  const initialExpiry = getExpiryDate(initialDate);

  const [formData, setFormData] = useState({
    fullNameEn: "",
    fullNameLocal: "",
    positionTitleEn: "",
    positionTitleLocal: "",
    idNumber: "",
    phone: "",
    issueDate: initialDate,
    expiryDate: initialExpiry,
    photo: null,
  });

  const [employeeData, setEmployeeData] = useState({
    fullNameEn: "",
    fullNameLocal: "",
    positionTitleEn: "",
    positionTitleLocal: "",
    idNumber: "",
    phone: "",
    issueDate: initialDate,
    expiryDate: initialExpiry,
    photo: null,
  });

  const [phoneError, setPhoneError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;
    
    // Hide preview if any field is edited to ensure re-validation on submit
    setIsSubmitted(false);
    
    setFormData((prev) => {
      let newValue = type === "file" ? files[0] : value;

      // Phone formatting and validation logic
      if (name === "phone") {
        newValue = value.replace(/\s+/g, '').replace(/[^\d+]/g, '');

        if (newValue.startsWith('+251')) {
          newValue = '0' + newValue.slice(4);
        } else if (newValue.startsWith('251') && newValue.length > 9) {
          newValue = '0' + newValue.slice(3);
        }

        // Auto-prefix with 0 if it starts with 9 or 7 and is 9 digits
        if (newValue.length === 9 && (newValue.startsWith('9') || newValue.startsWith('7'))) {
          newValue = '0' + newValue;
        }

        // Validation
        if (newValue.length > 0) {
          const isValid = /^0[79]\d{8}$/.test(newValue);
          if (newValue.length === 10 && !isValid) {
            setPhoneError("Starting digit should be 09... or 07...");
          } else if (newValue.length > 10) {
            setPhoneError("Phone number is too long (max 10 digits)");
          } else if (newValue.length > 0 && newValue.length < 10) {
            setPhoneError("Phone number should be 10 digits");
          } else {
            setPhoneError("");
          }
        } else {
          setPhoneError("");
        }
      }

      const newState = {
        ...prev,
        [name]: newValue,
      };

      // Auto-calculate expiry date if issue date changes
      if (name === "issueDate") {
        newState.expiryDate = getExpiryDate(value);
      }

      return newState;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Check if all fields are filled
    const requiredFields = [
      'fullNameEn', 'fullNameLocal', 'positionTitleEn', 
      'positionTitleLocal', 'idNumber', 'phone', 'issueDate', 'expiryDate', 'photo'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert("Please fill in all fields (including the photo) before generating the ID.");
      return;
    }

    if (phoneError) {
      alert("Please fix the phone number error first.");
      return;
    }

    setEmployeeData(formData);
    setIsSubmitted(true);
    console.log('Employee data updated and validated:', formData);
  };

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
      padding: "40px 20px",
      color: "#1c1e21",
    },
    header: {
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "800",
      color: "#1877f2",
      margin: "0",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      color: "#606770",
      fontSize: "1.1rem",
      marginTop: "8px",
    },
    main: {
      display: "flex",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto",
      flexWrap: "wrap",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
      width: "100%",
    },
    formContainer: {
      maxWidth: "450px",
    },
    previewContainer: {
      flex: "1",
      minWidth: "680px", // Large enough for the 171mm card
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#4b4f56",
      textTransform: "uppercase",
    },
    input: {
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #dddfe2",
      fontSize: "15px",
      backgroundColor: "#f5f6f7",
      outline: "none",
    },
    button: {
      backgroundColor: "#1877f2",
      color: "#fff",
      padding: "14px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background-color 0.2s",
    },
    previewHeader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "1px solid #eee",
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>OTech ID Automation</h1>
        <p style={styles.subtitle}>Generate professional identity cards instantly</p>
      </header>

      <div style={styles.main}>
        
        {/* Form Column */}
        <div style={{ ...styles.card, ...styles.formContainer }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '700' }}>Employee Information</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name (English)</label>
              <input
                required
                type="text"
                name="fullNameEn"
                placeholder="John Doe"
                style={styles.input}
                value={formData.fullNameEn}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name (Local)</label>
              <input
                required
                type="text"
                name="fullNameLocal"
                placeholder="ዮሐንስ ንጉሴ"
                style={styles.input}
                value={formData.fullNameLocal}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Position (EN)</label>
                <input
                  required
                  type="text"
                  name="positionTitleEn"
                  placeholder="Manager"
                  style={styles.input}
                  value={formData.positionTitleEn}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Position (Local)</label>
                <input
                  required
                  type="text"
                  name="positionTitleLocal"
                  placeholder="ሥራ አስኪያጅ"
                  style={styles.input}
                  value={formData.positionTitleLocal}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID Number</label>
                <input
                  required
                  type="text"
                  name="idNumber"
                  placeholder="OT/2026/001"
                  style={styles.input}
                  value={formData.idNumber}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="09..."
                  style={{ ...styles.input, borderColor: phoneError ? '#ff4d4f' : '#dddfe2' }}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {phoneError && <span style={{ color: '#ff4d4f', fontSize: '11px', marginTop: '4px' }}>{phoneError}</span>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Issue Date</label>
                <input
                  required
                  type="date"
                  name="issueDate"
                  style={styles.input}
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Expiry Date</label>
                <input
                  required
                  type="date"
                  name="expiryDate"
                  style={styles.input}
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Employee Photo</label>
              <input
                required
                type="file"
                name="photo"
                accept="image/*"
                style={{ ...styles.input, padding: '8px' }}
                onChange={handleChange}
              />
            </div>
            <button type="submit" style={styles.button}>Generate Card Preview</button>
          </form>
        </div>

        {/* Preview Column */}
        {isSubmitted && (
          <div style={{ ...styles.card, ...styles.previewContainer }}>
            <div style={styles.previewHeader}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1877f2' }}>Card Preview</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto', padding: '10px' }}>
              <IDTemplate {...employeeData} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
