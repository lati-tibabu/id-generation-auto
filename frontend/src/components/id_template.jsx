import React, { useRef } from 'react'
import './id_template.css'
import Barcode from 'react-barcode'
import QRCode from 'react-qr-code'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import frontTemplate from '../assets/template/Front.png'
import backTemplate from '../assets/template/Back.png'

const IDTemplate = (props) => {
  const frontRef = useRef();
  const backRef = useRef();

  const trackEvent = async (type) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, employeeId: props.id }),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  const exportAsImage = async (element, filename) => {
    // Wait for fonts to be ready and a small buffer for layout
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // scale to reach ~4000px width from 171.2mm (~647px base)
    const scaleFactor = 6.1818; 
    const canvas = await html2canvas(element, { 
      scale: scaleFactor,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    });
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const sanitizeFilename = (name) => {
    return name ? name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'id_card';
  };

  const exportFrontAsPNG = () => {
    const filename = `${sanitizeFilename(props.fullNameEn)}_front.png`;
    exportAsImage(frontRef.current, filename);
    trackEvent('download_png_front');
  };
  const exportBackAsPNG = () => {
    const filename = `${sanitizeFilename(props.fullNameEn)}_back.png`;
    exportAsImage(backRef.current, filename);
    trackEvent('download_png_back');
  };

  const exportAsPDF = async () => {
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));
    const scaleFactor = 6.1818;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [171.2, 107.96]
    });

    const frontCanvas = await html2canvas(frontRef.current, { 
      scale: scaleFactor, 
      useCORS: true 
    });
    const backCanvas = await html2canvas(backRef.current, { 
      scale: scaleFactor, 
      useCORS: true 
    });
    const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
    const backImgData = backCanvas.toDataURL('image/png', 1.0);

    pdf.addImage(frontImgData, 'PNG', 0, 0, 171.2, 107.96);
    pdf.addPage();
    pdf.addImage(backImgData, 'PNG', 0, 0, 171.2, 107.96);

    pdf.save(`${sanitizeFilename(props.fullNameEn)}.pdf`);
    trackEvent('download_pdf');
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#fff',
    color: '#2563eb',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb',
    color: '#fff',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      {/* Front ID */}
      <div className="id-card front-id" ref={frontRef}>
        <img src={frontTemplate} className="template-bg" alt="" />
        {/* Info Section */}
        <div className="info-section">
          <div className='name-job-secion'>
            {/* Name Section */}
            <div className="name-section">
              {/* <div className="english-name">Shimelis Fikadu Alemu</div> */}
              <div className="english-name">{props.fullNameEn}</div>
              {/* <div className="local-name">ሺመሊስ ፍቃዱ አለሙ</div> */}
              <div className="local-name">{props.fullNameLocal}</div>
            </div>

            {/* Job Position Section */}
            <div className="job-position">
              {/* <div className="position-title-en">Senior Project Manager</div> */}
              <div className="position-title-en">{props.positionTitleEn}</div>
              {/* <div className="position-title-local">ሽለኛ ፕሮጀክት ማናጀር</div> */}
              <div className="position-title-local">{props.positionTitleLocal}</div>
            </div>
          </div>

          <div className='id-validity'>

            <div className='id-val-section'>
              {/* ID Number Section */}
              {/* <div className="id-number">123456/2025</div> */}
              <div className="id-number">{props.idNumber}</div>
              {/* Phone Section */}
              {/* <div className="phone">+251 91 234-5678</div> */}
              <div className="phone">{props.phone}</div>
            </div>

            {/* Validity Section */}
            <div className='id-val-section'>
              {/* Issue Date */}
              {/* <div className="issue-date">Jun 13, 2025</div> */}
              <div className="issue-date">{props.issueDate}</div>
              {/* Expiry Date */}
              <div className="expiry-date">{props.expiryDate}</div>
            </div>

          </div>
        </div>

        {/* Photo Section */}
        <div className="photo-section">
          <div className="emp-photo">
            {props.photo && (
              <img 
                src={typeof props.photo === 'string' ? props.photo : URL.createObjectURL(props.photo)} 
                alt="Employee" 
              />
            )}
          </div>
          <div className="emp-id-bar">
            {props.idNumber && (
              <Barcode
                value={props.idNumber}
                format="CODE128"
                width={1}    // width of one bar in pixels
                height={35}    // height of the barcode in pixels
                displayValue={false} // hide the human-readable text if needed
                margin={2}
              />
            )}
          </div>

        </div>
      </div>


      {/* Back ID */}
      <div className="id-card back-id" ref={backRef}>
        <img src={backTemplate} className="template-bg" alt="" />
        {/* EMP ID QR Code Section */}
        <div className="qr-code-section">
          <div>
            {props.idNumber && (
              <QRCode 
                value={props.id ? `${window.location.origin}/employee/info/${props.id}` : props.idNumber} 
                size={90} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
        <button onClick={exportFrontAsPNG} style={buttonStyle}>PNG Front</button>
        <button onClick={exportBackAsPNG} style={buttonStyle}>PNG Back</button>
        <button onClick={exportAsPDF} style={primaryButtonStyle}>Download PDF</button>
      </div>
    </div>
  )
}

export default IDTemplate