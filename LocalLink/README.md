# 🔗 LocalLink — Find Trusted Local Services Near You

> **Tagline**: *"Find trusted local services near you."*

LocalLink is a full-stack web platform designed to solve the difficulty of finding reliable local service providers (electricians, plumbers, AC technicians, cleaners, carpenters, mechanics, appliance repair technicians, and painters) in new or unfamiliar areas.

Unlike bloated directories, LocalLink focuses on **direct phone contact**, **verified provider badges**, **ratings & customer reviews**, and **location-based discovery** without requiring complex online booking or payment gateways.

---

## 🌟 Key Features

### 👤 Customer Features
- **Location Discovery**: Filter by city, area, pincode, or automatic **Browser Geolocation API** detection.
- **Service Categories**: Browse electrician, plumber, AC repair, carpenter, cleaner, laptop/mobile repair, and more.
- **Provider Filtering**: Filter by minimum star rating, maximum starting price, experience level, and verified status.
- **Direct Phone Contact**: Click-to-call (`tel:`) buttons to speak directly with providers without middleman fees.
- **Ratings & Reviews**: Leave star ratings and feedback for completed services.
- **Reporting System**: Report suspicious providers or incorrect contact details to administrators.

### 💼 Provider Features
- **Registration**: Dedicated provider onboarding flow.
- **Profile Management**: Set business details, pricing, experience, specific services, and coverage areas.
- **Availability Toggle**: Real-time status toggling (`Available`, `Busy`, `Unavailable`).
- **Profile Image Upload**: Upload business photo via Multer file storage API.
- **Verification Tracking**: View pending, verified, or suspended account status.

### 🛡️ Admin Features
- **Moderation Dashboard**: Approve, reject, or suspend service provider applications.
- **Report Management**: Review reported providers and resolve customer tickets.
- **Category Administration**: Manage service categories and auto-seed default categories.

---

## 🏗️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+ Modules), CSS3 (Custom Design System).
- **Backend**: Node.js, Express.js.
- **Authentication**: Firebase Authentication (Email & Password, Role-Based JWT tokens).
- **Database**: Cloud Firestore (NoSQL document store).
- **Storage**: Firebase Storage / Multer Local File Uploads.
- **Security**: Express Helmet, CORS protection, Input validation middleware, RBAC authorization.

---

## 📁 Repository Structure

```
LocalLink/
├── client/                     # Frontend SPA Client
│   ├── css/
│   │   └── style.css           # 600+ lines CSS Design System
│   ├── js/
│   │   ├── pages/              # 10 Page Modules (Home, Services, Providers, Profile, Dashboards)
│   │   ├── api.js              # HTTP REST Client
│   │   ├── app.js              # App Initialization & Routing
│   │   ├── auth.js             # Firebase Auth Wrapper
│   │   ├── config.js           # App Configuration
│   │   ├── router.js           # Client-side Hash Router
│   │   └── ui.js               # UI Helpers (Toasts, Stars, Badges, Modals)
│   └── index.html              # Main SPA HTML Shell
├── server/                     # Express Backend Server
│   ├── src/
│   │   ├── config/             # Firebase Admin SDK Configuration
│   │   ├── controllers/        # Express Route Controllers
│   │   ├── middleware/         # Auth, Role, Upload, Validation Middleware
│   │   ├── routes/             # REST API Routes
│   │   ├── services/           # Firestore Service Layer
│   │   └── server.js           # Express Server Entry Point
│   ├── uploads/                # Provider Image Storage
│   └── package.json
├── docs/                       # Project Documentation
│   ├── api.md                  # REST API Reference
│   ├── architecture.md         # System Architecture & Diagrams
│   ├── database.md             # Firestore Database Schema
│   └── setup.md                # Installation & Firebase Setup Guide
├── README.md                   # Project Overview
└── .gitignore                  # Root Git Ignore Rules
```

---

## 🚀 Quick Start

1. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in `server/` and populate your Firebase Admin credentials.

3. **Start Backend**:
   ```bash
   cd server
   npm start
   ```

4. **Launch Frontend Client**:
   Serve the `client/` folder using `npx serve client` or live server on `http://localhost:3000`.

*Refer to [docs/setup.md](docs/setup.md) for full detailed step-by-step instructions.*

---

## 📄 License
This project is open-source and built for portfolio & educational demonstration.
