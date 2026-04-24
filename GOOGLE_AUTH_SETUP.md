# Google Authentication Setup Guide for Project Sigma

## Overview
Your Project Sigma tracker now has real Google OAuth 2.0 authentication integrated. This guide walks you through setting up your Google credentials.

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "NEW PROJECT"
3. Enter project name: `Sigma Tracker`
4. Click "CREATE"
5. Wait for the project to be created (may take a few seconds)

---

## Step 2: Enable Google Sign-In API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for `Google Identity Services`
3. Click on the first result (should say "Google Identity Services API")
4. Click **ENABLE**

---

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** button (top left)
3. Select **OAuth client ID**
4. If prompted, configure the OAuth consent screen:
   - Click **CONFIGURE CONSENT SCREEN**
   - Choose **External** (if developing)
   - Click **CREATE**
   - Fill in the required fields:
     - **App name**: `Sigma Tracker`
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Scroll to bottom and click **SAVE AND CONTINUE**
   - Skip scopes page (click **SAVE AND CONTINUE**)
   - Review and click **BACK TO DASHBOARD**

5. Now create the OAuth client:
   - Go back to **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: Select **Web application**
   - Name: `Sigma Tracker Web Client`
   - Add authorized JavaScript origins:
     - Click **+ ADD URI**
     - Enter: `http://localhost:3000`
     - Add another: `http://localhost:8000` (or your dev server port)
     - Add: `file://` (for local file development)
   - Add authorized redirect URIs:
     - Click **+ ADD URI**
     - Enter: `http://localhost:3000`
     - Add: `http://localhost:8000`
   - Click **CREATE**

6. A modal will appear with your credentials:
   - **Copy the Client ID** (you'll need this)
   - You can close the modal after copying

---

## Step 4: Add Your Client ID to Project Sigma

1. Open `auth.jsx` in your Project Sigma folder
2. Find this line at the top:
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID from Google Cloud
4. Example:
   ```javascript
   const GOOGLE_CLIENT_ID = "123456789-abcdefg.apps.googleusercontent.com";
   ```
5. Save the file

---

## Step 5: Test Your Setup

1. Open `Sigma Tracker.html` in your browser
2. You should see the sign-in screen with a "Sign in with Google" button
3. Click the button
4. Select a Google account to sign in with
5. You may see a consent screen asking for permissions (normal for first-time setup)
6. After authenticating, you should be logged into the tracker
7. Click "sign out" in the top right to test sign-out

---

## Troubleshooting

### "Google Sign-In library not loaded"
- Check browser console for errors (F12 → Console tab)
- Ensure your Client ID is correctly set in `auth.jsx`
- Clear browser cache and refresh

### "Failed to initialize Google Sign-In"
- Verify your Client ID in `auth.jsx`
- Check that you've enabled the Google Identity Services API
- Make sure your origin is in the authorized JavaScript origins list

### CORS errors
- If you see CORS errors, ensure your current URL (e.g., `file://`, `http://localhost:3000`) is added to:
  - Authorized JavaScript origins
  - Authorized redirect URIs
  in Google Cloud Console

### Button not appearing
- Wait 2-3 seconds (library takes time to load)
- Check browser console for errors
- Make sure JavaScript is enabled

---

## Production Deployment

When deploying to production:

1. Get your production domain (e.g., `example.com`)
2. Go back to Google Cloud Console → **Credentials**
3. Click on your OAuth client ID
4. Add to **Authorized JavaScript origins**:
   - `https://example.com`
5. Add to **Authorized redirect URIs**:
   - `https://example.com`
6. Update your `auth.jsx` with the same Client ID (or create a new one for production)
7. Deploy your app

---

## Security Notes

- **Never commit your Client ID to private repositories** if you're concerned about abuse
- The Client ID is actually safe to commit (it's public by design for web apps)
- User authentication tokens are stored in `localStorage` under `sigma.auth.v1`
- Always use HTTPS in production
- Consider implementing backend verification for production apps

---

## Architecture Overview

### Files Modified/Created:
- **auth.jsx** - Google OAuth handling functions
- **app.jsx** - Updated SignIn component to use real auth
- **Sigma Tracker.html** - Added Google Sign-In script tag

### Key Functions:
- `initializeGoogleSignIn()` - Initialize Google Sign-In
- `handleCredentialResponse()` - Process the JWT credential from Google
- `renderGoogleSignInButton()` - Render the official Google button
- `signOutGoogle()` - Sign out and clear auth data
- `getStoredAuth()` / `storeAuth()` - Manage persistent auth

### Auth Flow:
1. User loads app → checks for stored auth
2. If not authenticated, SignIn screen shows Google button
3. User clicks → Google presents consent screen
4. User grants permission → JWT credential received
5. JWT decoded to extract user profile (name, email, picture, etc.)
6. Profile stored in localStorage
7. App renders main Tracker interface

---

## Next Steps

Once you have everything working, consider:
- Implementing a backend API to securely verify tokens
- Storing user data on your server
- Adding more user customization features
- Setting up analytics to track user behavior

Enjoy your authenticated Sigma Tracker!
