# Kartik Watch Shop (Mehsana)

A luxury e-commerce platform for contemporary Swiss & Japanese haute horology, featuring a vanilla JavaScript frontend and a Python/Flask backend.

## Project Architecture

### Frontend
- **Technology Stack**: HTML5, Vanilla JavaScript, CSS3
- **Styling**: Modular CSS architecture (`frontend/css/modules/`). Custom properties defined in `01_variables.css` using a premium Obsidian, Champagne Gold, and Platinum Ivory palette.
- **Data Management**: Product catalog is driven by a localized JSON-like array in `frontend/js/watches-data.js`.
- **Pages**:
  - `index.html`: Boutique homepage featuring featured collections and hero sections.
  - `catalog.html`: Full watch catalog with filtering.
  - `product.html`: Detailed single product view with multi-angle gallery.
  - `auth.html`: Member concierge portal for sign-in and registration with OTP verification.

### Backend (Python/Flask)
- **Technology Stack**: Python, Flask, Flask-CORS
- **Server**: Runs on `http://127.0.0.1:5000`
- **Features**:
  - Exposes REST APIs for data retrieval and mock transactions.
  - Handles Cross-Origin Resource Sharing (CORS) to serve the frontend application locally.

## Recent AI-Driven Enhancements

During the recent development session, the following key AI-driven changes were integrated:

### 1. 360-Degree Multi-Angle Product Gallery
- **Assets**: Generated 4 high-resolution, luxury watch demonstration images (Front, Side, Back, Isometric views) to simulate a 360-degree product experience.
- **Data Update**: Enhanced `watches-data.js` schema to support an `images` array for mapping multiple views to a single watch reference.
- **UI Integration**: Modified `product.html` with vanilla JS logic to render interactive thumbnail galleries, allowing seamless swapping of the main product visual on click.

### 2. Premium Auth & OTP Portal Redesign
- **Glassmorphism UI**: Completely rewrote `13_auth.css` to feature a dark-mode "Haute Horology" aesthetic with dynamic ambient glows, frosted glass cards (backdrop-filter), and subtle gold accents.
- **Enhanced OTP Verification**: Upgraded the two-factor authentication (OTP) modal. It now features a prominent 6-digit input grid, animated states, and a premium overlaid backdrop blur.
- **Sign-in Interface**: Improved form inputs with glowing focus states, floating labels, and integrated social auth styling.

## Running the Application
1. Start the Flask Backend Server (ensure dependencies are installed):
   ```bash
   cd backend
   python app.py
   ```
2. Serve the `frontend` directory using any local static web server (e.g. Live Server, Python `http.server`, etc.).