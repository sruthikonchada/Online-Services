# LocalLink — REST API Reference Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require a Firebase ID token in the HTTP Authorization header:
`Authorization: Bearer <FIREBASE_ID_TOKEN>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Create user profile document upon Firebase Auth registration.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91 9876543210",
    "role": "customer" // customer | provider | admin
  }
  ```
- **Response** (`201 Created`):
  ```json
  { "success": true, "message": "User registered successfully", "data": { ... } }
  ```

### `GET /api/auth/profile` *(Protected)*
Get current authenticated user's profile.
- **Response** (`200 OK`):
  ```json
  { "success": true, "data": { "uid": "...", "email": "...", "role": "customer" } }
  ```

### `PUT /api/auth/profile` *(Protected)*
Update customer profile name or phone number.
- **Request Body**: `{ "name": "Updated Name", "phone": "+91 9999999999" }`

---

## 2. Service Category Endpoints (`/api/categories`)

### `GET /api/categories`
Get list of all active service categories.

### `GET /api/categories/:id`
Get single category details by ID.

---

## 3. Service Provider Endpoints (`/api/providers`)

### `GET /api/providers/search`
Search and filter verified service providers.
- **Query Parameters**:
  - `categoryId`: Filter by category ID (e.g. `electrician`)
  - `city`: Filter by city (case-insensitive substring)
  - `area`: Filter by area or pincode
  - `minRating`: Minimum average rating (e.g. `4.0`)
  - `maxPrice`: Maximum starting price (e.g. `500`)
  - `minExperience`: Minimum years of experience
  - `verified`: `'true'` or `'false'` (default: `'true'`)
  - `sortBy`: `'rating'` | `'price'` | `'experience'`
  - `latitude`, `longitude`, `maxDistance`: Distance calculation parameters
- **Response** (`200 OK`): Array of matching provider profile objects.

### `GET /api/providers/:id`
Get detailed provider profile by ID.

### `GET /api/providers/me` *(Protected — Provider Only)*
Get authenticated provider's own business profile.

### `POST /api/providers` *(Protected — Provider Only)*
Create initial provider business profile.
- **Request Body**:
  ```json
  {
    "businessName": "Apex Electrical",
    "categoryId": "electrician",
    "phone": "+91 9876543210",
    "description": "Professional electrical services.",
    "experience": 5,
    "startingPrice": 299,
    "services": ["Wiring", "Switchboard", "Fan Repair"],
    "city": "Mumbai",
    "area": "Andheri West",
    "pincode": "400053",
    "serviceAreas": ["Andheri", "Juhu", "Bandra"]
  }
  ```

### `PUT /api/providers/:id` *(Protected — Provider Owner / Admin)*
Update provider profile details or availability status (`available` | `busy` | `unavailable`).

### `POST /api/providers/:id/image` *(Protected — Provider Owner / Admin)*
Upload business profile image (Multipart Form Data `image` field).

---

## 4. Review Endpoints (`/api/reviews`)

### `POST /api/reviews` *(Protected — Customer Only)*
Submit rating & review for a service provider.
- **Request Body**:
  ```json
  {
    "providerId": "PROV123",
    "rating": 5,
    "comment": "Prompt service and fixed the issue quickly!"
  }
  ```

### `GET /api/reviews/provider/:providerId`
Get all customer reviews for a given provider.

---

## 5. Report Endpoints (`/api/reports`)

### `POST /api/reports` *(Protected — Customer Only)*
Report a provider for inappropriate behavior or incorrect details.

---

## 6. Admin Endpoints (`/api/admin`) *(Protected — Admin Only)*

### `GET /api/admin/providers/pending`
Fetch provider profiles awaiting admin verification.

### `GET /api/admin/providers`
Fetch all registered provider business profiles.

### `PUT /api/admin/providers/:id/approve`
Approve pending provider registration.

### `PUT /api/admin/providers/:id/reject`
Reject pending provider registration.

### `PUT /api/admin/providers/:id/suspend`
Suspend active provider profile.

### `GET /api/admin/reports`
Get all reported provider tickets.

### `PUT /api/admin/reports/:id`
Update report status (`resolved` | `dismissed`).

### `POST /api/admin/categories/seed`
Seed default service categories into Firestore.
