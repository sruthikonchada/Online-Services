# LocalLink — Database Schema Documentation (Cloud Firestore)

LocalLink utilizes Google Cloud Firestore as its primary NoSQL document database.

## Collections Overview

```
Firestore Root
 ├── users/
 ├── providers/
 ├── categories/
 ├── services/
 ├── reviews/
 └── reports/
```

---

## 1. Collection: `users`
Stores customer, provider, and administrator user account profiles.

| Field Name | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth User ID |
| `email` | string | User's email address |
| `name` | string | Full name |
| `phone` | string | Phone number |
| `role` | string | `'customer'`, `'provider'`, or `'admin'` |
| `createdAt` | ISO string | Account creation timestamp |
| `updatedAt` | ISO string | Last profile update timestamp |

---

## 2. Collection: `providers`
Stores detailed service provider business profiles and verification data.

| Field Name | Type | Description |
|---|---|---|
| `id` | string | Provider record unique ID |
| `userId` | string | Foreign key reference to `users.uid` |
| `businessName` | string | Registered shop/business name |
| `phone` | string | Public phone number for direct customer calls |
| `description` | string | Business overview & expertise |
| `categoryId` | string | Primary service category reference |
| `services` | array[string] | List of specific services offered |
| `experience` | number | Years of professional experience |
| `startingPrice` | number | Minimum service charge (₹) |
| `serviceAreas` | array[string] | Array of neighborhood/area names covered |
| `city` | string | City name |
| `area` | string | Locality or area name |
| `pincode` | string | Postal code |
| `latitude` | number | Geolocation latitude (optional) |
| `longitude` | number | Geolocation longitude (optional) |
| `availability` | string | `'available'`, `'busy'`, or `'unavailable'` |
| `profileImage` | string | URL or path to uploaded profile image |
| `verificationStatus` | string | `'pending'`, `'verified'`, `'rejected'`, `'suspended'` |
| `averageRating` | number | Computed average star rating (0.0 to 5.0) |
| `totalReviews` | number | Count of customer reviews submitted |
| `createdAt` | ISO string | Creation timestamp |
| `updatedAt` | ISO string | Modification timestamp |

---

## 3. Collection: `categories`
Service categories (e.g. Electrician, Plumber, AC Technician).

| Field Name | Type | Description |
|---|---|---|
| `id` | string | Category slug identifier (e.g. `electrician`) |
| `name` | string | Display category title |
| `icon` | string | Emoji icon or icon name |
| `description` | string | Short description of services included |

---

## 4. Collection: `reviews`
Customer ratings and reviews for service providers.

| Field Name | Type | Description |
|---|---|---|
| `id` | string | Unique review identifier |
| `providerId` | string | Target provider ID |
| `customerId` | string | Customer user ID |
| `customerName` | string | Name of customer reviewer |
| `rating` | number | Star rating (1 to 5) |
| `comment` | string | Written review feedback |
| `createdAt` | ISO string | Submission timestamp |

---

## 5. Collection: `reports`
Provider issue reports submitted by customers.

| Field Name | Type | Description |
|---|---|---|
| `id` | string | Unique report identifier |
| `providerId` | string | Provider being reported |
| `customerId` | string | Reporting customer user ID |
| `reason` | string | Report reason category |
| `description` | string | Customer explanation |
| `status` | string | `'pending'`, `'resolved'`, `'dismissed'` |
| `createdAt` | ISO string | Creation timestamp |
| `resolvedAt` | ISO string | Resolution timestamp |
