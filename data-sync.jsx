// Data Sync Module — Backend-Ready Layer
// Abstracts data storage so it's easy to switch from localStorage to backend API

// Configuration — Update this when you have a backend
const API_BASE_URL = null; // Set to your backend URL when ready (e.g., "https://api.sigma.com")
const USE_BACKEND = API_BASE_URL !== null;

// ========== API CALL HELPERS ==========

async function apiCall(endpoint, method = "GET", data = null) {
  if (!API_BASE_URL) {
    console.warn(`API call would go to: ${endpoint} but no backend configured`);
    return null;
  }

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getStoredAuth()?.token}`, // Send Google token
      },
    };

    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    return null;
  }
}

// ========== TRACKER DATA SYNC ==========

async function syncTrackerData(userId, entries, profile) {
  if (!USE_BACKEND) return; // Skip if no backend
  
  const result = await apiCall("/api/tracker/sync", "POST", {
    userId,
    entries,
    profile,
    timestamp: new Date().toISOString(),
  });

  if (result) {
    console.log("Data synced to backend");
  }
}

async function fetchTrackerData(userId) {
  if (!USE_BACKEND) return null; // Return null to use localStorage

  const result = await apiCall(`/api/tracker/${userId}`, "GET");
  if (result) {
    console.log("Data fetched from backend");
    return result; // Should have { entries, profile }
  }
  return null;
}

// ========== SINGLE ENTRY SYNC ==========

async function syncEntryData(userId, date, entry) {
  if (!USE_BACKEND) return;

  await apiCall(`/api/tracker/${userId}/entries/${date}`, "PUT", entry);
}

async function deleteEntryData(userId, date) {
  if (!USE_BACKEND) return;

  await apiCall(`/api/tracker/${userId}/entries/${date}`, "DELETE");
}

// ========== PROFILE SYNC ==========

async function syncProfileData(userId, profile) {
  if (!USE_BACKEND) return;

  await apiCall(`/api/tracker/${userId}/profile`, "PUT", profile);
}

// ========== MERGE STRATEGY (FOR FUTURE USE) ==========
// When user logs in on a new device, merge backend data with local data

function mergeTrackerData(localData, backendData) {
  if (!backendData) return localData;
  if (!localData || Object.keys(localData).length === 0) return backendData;

  // Merge strategy: backend data is source of truth, local overwrites if newer
  // You can customize this logic based on timestamps later
  return { ...backendData, ...localData };
}

// ========== EXPECTED BACKEND ENDPOINTS ==========
/*
Your backend should implement these endpoints:

POST /api/tracker/sync
  Request: { userId, entries, profile, timestamp }
  Response: { success: true }

GET /api/tracker/:userId
  Response: { entries: {...}, profile: {...} }

PUT /api/tracker/:userId/entries/:date
  Request: { entry data }
  Response: { success: true }

DELETE /api/tracker/:userId/entries/:date
  Response: { success: true }

PUT /api/tracker/:userId/profile
  Request: { profile data }
  Response: { success: true }

All endpoints should require Authorization header with Google token.
Backend should verify the token and ensure userId matches the token's user.
*/
