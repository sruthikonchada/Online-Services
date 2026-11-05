# LocalLink — Setup & Configuration Guide

This guide walks you through setting up and running **LocalLink** locally.

---

## 1. Prerequisites
- **Node.js** v16+ installed
- **npm** v8+ installed
- A **Firebase Console** account (Free Spark plan works fine)

---

## 2. Server Installation & Setup

1. Open terminal and navigate to `server/`:
   ```bash
   cd server
   npm install
   ```

2. Create `.env` file inside `server/` directory:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in `server/.env`:
   ```ini
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Firebase Admin SDK Credentials
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR-PRIVATE-KEY\n-----END PRIVATE KEY-----\n"
   FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com
   ```

---

## 3. Firebase Console Configuration (Manual Step)

To enable authentication and data storage for LocalLink:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click **Add Project** and name it `locallink` (or your preferred name).

2. **Enable Firebase Authentication**:
   - Navigate to **Authentication** > **Get Started**.
   - Enable **Email/Password** sign-in method.

3. **Enable Cloud Firestore**:
   - Navigate to **Firestore Database** > **Create Database**.
   - Select **Start in Test Mode** (or configure security rules).
   - Choose a location near your target users.

4. **Web App Firebase Config (Frontend)**:
   - Go to **Project Settings** (⚙️ gear icon) > **General**.
   - Under *Your apps*, click `</>` (Web app) and register the app.
   - Copy the `firebaseConfig` object values.
   - Paste these values into `client/js/config.js`:
     ```javascript
     FIREBASE: {
       apiKey: "AIzaSy...",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "...",
       appId: "..."
     }
     ```

5. **Generate Admin SDK Credentials (Backend)**:
   - In Firebase Console, go to **Project Settings** > **Service Accounts**.
   - Click **Generate New Private Key** (downloads a `.json` file).
   - Open the JSON file and copy:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY` (keep `\n` line breaks format)

---

## 4. Running the Application

### Start Backend Express Server:
```bash
cd server
npm start
```
*Server will start on `http://localhost:5000`.*

### Start Frontend Web Client:
You can use any static server or VS Code Live Server:
```bash
# Using npx serve (or live-server)
npx serve client -p 3000
```
*Open `http://localhost:3000` in your web browser.*

---

## 5. Testing Role Workflows

1. **Category Seeding**:
   - Log in as Admin or trigger category seeding via Admin panel / API to populate categories.

2. **Customer Flow**:
   - Click **Register**, select **Customer**, sign up.
   - Search for providers by city, category, rating, or price.
   - Click a provider to view phone number and call directly.

3. **Provider Flow**:
   - Click **Register**, select **Provider**, sign up.
   - Complete provider profile (business name, category, pricing, city, service areas).
   - Dashboard will show **Verification Pending**.

4. **Admin Approval**:
   - Log in with Admin account.
   - Navigate to **Pending Approvals** tab.
   - Click **Approve** on the provider.
   - The provider profile will now appear publicly in customer searches!
