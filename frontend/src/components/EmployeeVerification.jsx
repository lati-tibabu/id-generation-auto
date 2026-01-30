import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Phone, IdCard, Calendar, CheckCircle, AlertCircle, Building } from 'lucide-react';

const EmployeeVerification = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/employees/${id}`);
                if (!response.ok) {
                    throw new Error('Employee not found or verification failed');
                }
                const data = await response.json();
                setEmployee(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #fee2e2', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <AlertCircle style={{ width: '64px', height: '64px', color: '#ef4444', marginBottom: '16px' }} />
                    <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Verification Failed</h1>
                    <p style={{ color: '#4b5563', textAlign: 'center', marginBottom: '24px' }}>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const isActive = new Date(employee.expiryDate) > new Date();

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '450px'
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={cardStyle}>
                {/* Header/Status */}
                <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <div style={{ width: '128px', height: '128px', borderRadius: '50%', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', backgroundColor: '#f1f5f9' }}>
                            {employee.photo ? (
                                <img src={employee.photo} alt={employee.fullNameEn} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                            ) : (
                                <User style={{ width: '100%', height: '100%', padding: '24px', color: '#94a3b8' }} />
                            )}
                        </div>
                        <div style={{ position: 'absolute', bottom: '-8px', right: '8px', backgroundColor: 'white', borderRadius: '50%', padding: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {isActive ? (
                                <CheckCircle style={{ width: '32px', height: '32px', color: '#10b981' }} />
                            ) : (
                                <AlertCircle style={{ width: '32px', height: '32px', color: '#f97316' }} />
                            )}
                        </div>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', textAlign: 'center', margin: '0 0 4px 0' }}>{employee.fullNameEn}</h1>
                    <p style={{ color: '#2563eb', fontWeight: '600', margin: 0 }}>{employee.positionTitleEn}</p>
                    <div style={{ 
                        marginTop: '16px', 
                        padding: '6px 16px', 
                        borderRadius: '9999px', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        backgroundColor: isActive ? '#d1fae5' : '#fee2e2',
                        color: isActive ? '#065f46' : '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {isActive ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {isActive ? 'Verified Active ID' : 'ID Expired'}
                    </div>
                </div>

                {/* Details Section */}
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <InfoItem icon={IdCard} label="ID Number" value={employee.idNumber} />
                        <InfoItem icon={User} label="Full Name (Local)" value={employee.fullNameLocal} />
                        <InfoItem icon={Building} label="Position (Local)" value={employee.positionTitleLocal} />
                        <InfoItem icon={Phone} label="Phone Number" value={employee.phone} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <InfoItem icon={Calendar} label="Issue Date" value={new Date(employee.issueDate).toLocaleDateString()} />
                            <InfoItem icon={Calendar} label="Expiry Date" value={new Date(employee.expiryDate).toLocaleDateString()} />
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: '12px', textAlign: 'center', color: '#94a3b8', lineHeight: '1.5' }}>
                            This is an official digital verification of employment for OTECH Secure ID System. 
                            For any inquiries, please contact our support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Brand */}
            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                <span style={{ fontWeight: '800', tracking: '0.1em', fontSize: '14px' }}>OTECH</span>
                <div style={{ width: '4px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '14px' }}>Secure ID System</span>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon style={{ width: '20px', height: '20px', color: '#2563eb' }} />
        </div>
        <div>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>{label}</p>
            <p style={{ fontSize: '16px', fontWeights: '600', color: '#1e293b', margin: 0 }}>{value}</p>
        </div>
    </div>
);

export default EmployeeVerification;
