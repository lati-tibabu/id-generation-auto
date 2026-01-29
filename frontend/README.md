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
- **AI Background Removal**: Automatically removes the background from uploaded employee photos directly in the browser using `@imgly/background-removal`.
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
  - `@imgly/background-removal`: For client-side AI background removal.

## 🖼️ Background Removal Implementation

This project uses `@imgly/background-removal` to process employee photos directly in the browser. This ensures data privacy as the images never leave the user's device and avoids server-side processing costs.

### Key Technical Details

- **Model**: `isnet_quint8` (the quantized version) is used for a balance between speed and quality (approx. 40MB).
- **Execution**: Runs in the browser using WASM and ONNX Runtime.
- **Preloading**: Models are preloaded when the `IDForm` or `EmployeeList` components mount to ensure responsiveness when the user actually uploads an image.
- **Performance**: High performance is achieved by cross-origin isolating the site via COOP/COEP headers, enabling the use of `SharedArrayBuffer` for multi-threaded processing.

### Configuration

The integration is configured in `vite.config.js` to serve the necessary headers:

```javascript
server: {
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  },
}
```

### Usage in Code

To use the background removal in a component:

```javascript
import { removeBackground } from "@imgly/background-removal";

const handleUpload = async (file) => {
  setIsLoading(true);
  try {
    const processedBlob = await removeBackground(file, {
      model: 'isnet_quint8',
      progress: (key, current, total) => {
        console.log(`Downloading ${key}: ${Math.round(current/total*100)}%`);
      }
    });
    // Use the processedBlob as an image source
  } catch (error) {
    console.error("Background removal failed", error);
  } finally {
    setIsLoading(false);
  }
};
```

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
