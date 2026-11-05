# LocalLink — System Architecture Documentation

## Overview
LocalLink is a full-stack Single Page Application (SPA) designed to help residents and newcomers quickly locate, evaluate, and directly contact verified local service professionals (e.g., electricians, plumbers, AC technicians, cleaners).

---

## Technical Stack Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND SPA                        │
│          HTML5 · CSS3 (Design System) · Vanilla JS      │
│  Router · Auth (Firebase SDK) · API Client (Fetch)      │
└────────────────────────────┬────────────────────────────┘
                             │
                      HTTP REST Requests
                    (Authorization: Bearer Token)
                             │
┌────────────────────────────▼────────────────────────────┐
│                    EXPRESS BACKEND                      │
│     Node.js · CORS · Helmet · Express-Validator         │
│     Multer (File Uploads) · Firebase Admin SDK          │
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                   FIREBASE SERVICES                     │
│    Firebase Authentication · Cloud Firestore · Storage  │
└─────────────────────────────────────────────────────────┘
```

---

## Role-Based Access Control (RBAC) Architecture

- **CUSTOMER**: Can browse service categories, search providers by city/area/pincode or GPS coordinates, view provider profiles, call providers directly, submit ratings & reviews, and report providers.
- **PROVIDER**: Can register a service business profile, edit services/pricing/coverage, manage live availability status (Available, Busy, Unavailable), upload profile images, and view customer reviews.
- **ADMIN**: Has complete administrative moderation privileges: approves/rejects pending provider applications, suspends/restores profiles, manages service categories, auto-seeds default categories, and resolves/dismisses customer reports.

---

## Frontend Modular Architecture

The frontend is constructed without external heavy frameworks to ensure lightning-fast performance, simple deployment, and standard web compliance:

- `index.html` — Master SPA shell & navigation drawer.
- `css/style.css` — Modern design system with CSS custom properties (variables), responsive flex/grid layouts, card components, form controls, modals, and status badges.
- `js/config.js` — Global application configuration, API base URL, Firebase project keys, and constants.
- `js/auth.js` — Wrapper around Firebase Auth SDK managing user session state, role tokens, login, registration, and logout.
- `js/api.js` — Centralized HTTP client handling fetch requests, token header injection, error handling, and file uploads.
- `js/router.js` — Client-side hash-based SPA routing system supporting parameterized routes (e.g., `/providers/:id`).
- `js/ui.js` — Helper utilities for toast notifications, star rating renderers, avatar generators, status badges, and loading/empty state overlays.
- `js/pages/*.js` — 10 page view controllers rendering dynamic HTML and binding DOM event handlers.
