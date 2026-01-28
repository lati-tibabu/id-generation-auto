# Otech ID Generator

A semi-automated professional ID card generation tool built with React and Vite. This application allows users to quickly generate, preview, and export high-quality employee ID cards in both image (PNG) and PDF formats.

## 🚀 Features

- **Dual-Sided ID Generation**: Automatically generates both Front and Back sides of the ID card using predefined templates.
- **Dynamic Data Entry**: Fill in employee details via an interactive form:
  - Full Name (English & Local Language)
  - Position Title (English & Local Language)
  - ID Number
  - Phone Number (with auto-formatting and validation)
  - Issue & Expiry Dates (Auto-calculates expiry date based on issue date)
  - Employee Photo Upload
- **Automated Codes**: Generates unique Barcodes and QR codes for each ID card.
- **High-Resolution Export**: 
  - Export front/back sides individually as **PNG**.
  - Export the complete double-sided ID as a **PDF**.
  - Optimized scaling for professional print quality (~4000px width).

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Libraries**:
  - `html2canvas`: For rendering DOM elements to images.
  - `jspdf`: For PDF generation.
  - `react-barcode`: For dynamic barcode rendering.
  - `react-qr-code`: For dynamic QR code rendering.

## 📥 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lati-tibabu/id-generation-auto.git
   cd id-generation-auto/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Enter Data**: Fill out the employee information form on the main page.
2. **Preview**: The ID card preview will update as you fill in the details. 
3. **Validate**: The form includes validation for phone numbers (expecting 09... or 07...) and ensures all required fields are filled.
4. **Export**: Use the "Export as PNG" or "Export as PDF" buttons to save the generated ID cards.

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Card templates and images
│   ├── components/      # React components (ID Form, ID Template)
│   ├── App.jsx          # Main application logic and state
│   └── main.jsx         # Entry point
└── ...
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
