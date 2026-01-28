# OTech ID Generation Auto

A comprehensive ID card generation and management system for employees.

## Features

- Generate professional ID cards with employee information
- Store employee data in PostgreSQL database
- Employee photos stored as base64 in database
- Responsive web interface with sidebar navigation
- Export ID cards as PNG images or PDF
- Employee directory management

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL database
- Sequelize ORM
- CORS support

### Frontend
- React.js
- Vite build tool
- HTML2Canvas for image export
- jsPDF for PDF export
- React Barcode & QR Code libraries

## Project Structure

```
id-generation-auto/
├── backend/
│   ├── models/
│   │   ├── Employee.js
│   │   └── index.js
│   ├── routes/
│   │   └── employeeRoutes.js
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── README.md
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── EmployeeList.jsx
    │   │   ├── id_template.jsx
    │   │   └── id_form.jsx
    │   ├── assets/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Backend Setup
1. Navigate to `backend/` directory
2. Follow the setup instructions in `backend/README.md`

### Frontend Setup
1. Navigate to `frontend/` directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Running the Application
1. **Set up PostgreSQL database** (see backend/README.md)
2. Start the backend server: `cd backend && npm start`
3. Start the frontend development server: `cd frontend && npm run dev`
4. Open http://localhost:5174 in your browser

**Note**: Make sure PostgreSQL is running and the database is created before starting the backend.

## Usage

1. **Generate ID**: Fill in employee information and upload photo
2. **Preview**: View the generated ID card
3. **Export**: Download as PNG or PDF
4. **Manage**: View all employees in the directory

## API Documentation

See `backend/README.md` for API endpoint details.