# Backend Implementation Guide for Project Sigma

## Overview

Your frontend is now **backend-ready**! The `data-sync.jsx` module abstracts all data storage, making it trivial to add a backend later.

---

## How It Works (Current State)

**Right now:** All data stays in browser's `localStorage` (offline-first)

**When backend is ready:** Just add `API_BASE_URL` to `data-sync.jsx` and implement the endpoints

---

## Quick Setup (When You Have a Backend)

### Step 1: Update `data-sync.jsx`

Change this line:
```javascript
const API_BASE_URL = null; // Set to your backend URL when ready
```

To:
```javascript
const API_BASE_URL = "https://your-api.com";
```

That's it! The rest happens automatically.

---

## Backend Endpoints to Implement

Your backend needs these 5 endpoints:

### 1. **POST /api/tracker/sync** — Full data sync
**When:** User logs in (optional, for cross-device sync)

**Request:**
```json
{
  "userId": "google_id_123",
  "entries": { "2024-04-20": {...}, "2024-04-21": {...} },
  "profile": { "heightCm": 178, "age": 28, "sex": "m", "activity": 1.55 },
  "timestamp": "2024-04-24T10:30:00Z"
}
```

**Response:**
```json
{ "success": true }
```

---

### 2. **GET /api/tracker/:userId** — Fetch all user data
**When:** User logs in (to sync from other devices)

**Response:**
```json
{
  "entries": { "2024-04-20": {...}, "2024-04-21": {...} },
  "profile": { "heightCm": 178, "age": 28, "sex": "m", "activity": 1.55 }
}
```

---

### 3. **PUT /api/tracker/:userId/entries/:date** — Save single entry
**When:** User logs a workout/meal/weight

**Request:**
```json
{
  "date": "2024-04-24",
  "meals": [{ "name": "Breakfast", "calories": 500 }, ...],
  "workouts": [{ "kind": "Running", "minutes": 30 }, ...],
  "weight": 75.5,
  "prayers": [true, false, true, false, true]
}
```

**Response:**
```json
{ "success": true }
```

---

### 4. **DELETE /api/tracker/:userId/entries/:date** — Delete entry
**When:** User clears a day

**Response:**
```json
{ "success": true }
```

---

### 5. **PUT /api/tracker/:userId/profile** — Update profile
**When:** User changes height/age/sex/activity level

**Request:**
```json
{
  "heightCm": 180,
  "age": 29,
  "sex": "m",
  "activity": 1.725
}
```

**Response:**
```json
{ "success": true }
```

---

## Authentication

All requests include:
```
Authorization: Bearer <GOOGLE_JWT_TOKEN>
```

**On your backend:**
1. Extract the token from the Authorization header
2. Verify it with Google's public keys
3. Extract `sub` (user's Google ID) from the token
4. Ensure the `:userId` in the URL matches the token's `sub`
5. Proceed if valid, return 401 if not

---

## Database Schema

### Users Table
```
id (primary key)
google_id (unique) - From JWT `sub` field
email - From JWT `email` field
created_at
updated_at
```

### Tracker Entries Table
```
id (primary key)
user_id (foreign key → Users)
date (YYYY-MM-DD)
meals (JSON)
workouts (JSON)
weight (float)
prayers (JSON array)
created_at
updated_at
```

### User Profiles Table
```
id (primary key)
user_id (unique foreign key → Users)
height_cm (int)
age (int)
sex (char: 'm' or 'f')
activity (float)
created_at
updated_at
```

---

## Example: Node.js + Express Backend

### Setup

```bash
npm install express cors dotenv jsonwebtoken axios
```

### Basic Implementation

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(cors());

// Verify Google token
async function verifyGoogleToken(token) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );
    return response.data; // Contains 'user_id', 'email', etc.
  } catch (error) {
    return null;
  }
}

// Middleware: Verify auth header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.sendStatus(401);

  verifyGoogleToken(token).then(data => {
    if (!data) return res.sendStatus(401);
    req.userId = data.user_id;
    req.userEmail = data.email;
    next();
  });
}

// Endpoints

app.post('/api/tracker/sync', authenticateToken, async (req, res) => {
  const { userId, entries, profile, timestamp } = req.body;

  if (userId !== req.userId) return res.sendStatus(403); // Unauthorized

  // Save to database
  // db.trackerData.update({ userId }, { entries, profile, updatedAt: timestamp });

  res.json({ success: true });
});

app.get('/api/tracker/:userId', authenticateToken, async (req, res) => {
  if (req.params.userId !== req.userId) return res.sendStatus(403);

  // Fetch from database
  // const data = db.trackerData.findOne({ userId });

  res.json({ entries: {}, profile: {} });
});

app.put('/api/tracker/:userId/entries/:date', authenticateToken, async (req, res) => {
  if (req.params.userId !== req.userId) return res.sendStatus(403);

  // Save entry to database
  // db.entries.insertOne({ userId, date, ...req.body });

  res.json({ success: true });
});

app.delete('/api/tracker/:userId/entries/:date', authenticateToken, async (req, res) => {
  if (req.params.userId !== req.userId) return res.sendStatus(403);

  // Delete entry from database
  // db.entries.deleteOne({ userId, date });

  res.json({ success: true });
});

app.put('/api/tracker/:userId/profile', authenticateToken, async (req, res) => {
  if (req.params.userId !== req.userId) return res.sendStatus(403);

  // Update profile in database
  // db.profiles.updateOne({ userId }, req.body);

  res.json({ success: true });
});

app.listen(3001, () => console.log('Server running on port 3001'));
```

---

## Deployment Checklist

When you deploy your backend:

- [ ] Add backend URL to `data-sync.jsx` `API_BASE_URL`
- [ ] Deploy backend to production
- [ ] Update `API_BASE_URL` in `data-sync.jsx` to production URL
- [ ] Add production domain to Google OAuth authorized origins
- [ ] Test cross-device sync:
  - Log in on Device A
  - Log in on Device B
  - Data should sync automatically

---

## What Happens When Backend Is Live

1. **User logs in** → Data syncs
2. **User logs workout** → Saved to localStorage AND sent to backend
3. **User logs in elsewhere** → Fetches data from backend
4. **User logs out** → Backend retains data
5. **User returns weeks later** → All previous data restored

---

## Development vs Production

**Development:** Leave `API_BASE_URL = null` to test with localStorage only

**Production:** Set `API_BASE_URL = "https://your-api.com"` to use backend

---

## Testing Without Backend

Since the frontend is backend-optional, you can:

1. **Test UI changes** without backend
2. **Keep testing locally** without a server
3. **Deploy frontend to GitHub Pages** without backend (data stays local)
4. **Add backend whenever you're ready**

The `data-sync.jsx` module gracefully handles both scenarios.

---

## Next Steps

1. Choose your backend framework (Node.js, Python, etc.)
2. Create a database (MongoDB, PostgreSQL, etc.)
3. Implement the 5 endpoints
4. Set `API_BASE_URL` in `data-sync.jsx`
5. Deploy and test cross-device sync

That's it! The frontend is already prepared.
