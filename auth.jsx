// Google Authentication Module
// Handles Google Sign-In via OAuth 2.0

const GOOGLE_CLIENT_ID = "662157377538-dj0vamgrbk23lec2p0a08rvcuc7neiuv.apps.googleusercontent.com"; // Replace with your Client ID

// Initialize Google Sign-In
function initializeGoogleSignIn(onSuccess, onError) {
  if (!window.google) {
    console.error("Google Sign-In library not loaded");
    onError("Google Sign-In library not loaded");
    return;
  }

  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    
    // Store callbacks globally for the credential response handler
    window.__authCallbacks = { onSuccess, onError };
  } catch (error) {
    console.error("Failed to initialize Google Sign-In:", error);
    onError(error);
  }
}

// Handle the credential response from Google
function handleCredentialResponse(response) {
  if (!response.credential) {
    if (window.__authCallbacks?.onError) {
      window.__authCallbacks.onError("No credential received");
    }
    return;
  }

  try {
    // Decode the JWT token
    const base64Url = response.credential.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    const userData = JSON.parse(jsonPayload);
    
    const userProfile = {
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
      firstName: userData.given_name,
      lastName: userData.family_name,
      googleId: userData.sub,
      token: response.credential,
    };

    if (window.__authCallbacks?.onSuccess) {
      window.__authCallbacks.onSuccess(userProfile);
    }
  } catch (error) {
    console.error("Failed to decode credential:", error);
    if (window.__authCallbacks?.onError) {
      window.__authCallbacks.onError(error);
    }
  }
}

// Render the Google Sign-In button
function renderGoogleSignInButton(elementId) {
  if (!window.google) {
    console.error("Google Sign-In library not loaded");
    return;
  }

  try {
    google.accounts.id.renderButton(document.getElementById(elementId), {
      type: "standard",
      size: "large",
      theme: "outline",
      text: "continue_with",
      locale: "en_US",
    });
  } catch (error) {
    console.error("Failed to render Sign-In button:", error);
  }
}

// Sign out from Google
function signOutGoogle() {
  try {
    if (window.google && window.google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    // Clear local auth data
    localStorage.removeItem("sigma.auth.v1");
  } catch (error) {
    console.error("Sign out failed:", error);
  }
}

// Check if user is already authenticated
function getStoredAuth() {
  try {
    const stored = localStorage.getItem("sigma.auth.v1");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to retrieve stored auth:", error);
  }
  return null;
}

// Store auth data locally
function storeAuth(authData) {
  try {
    localStorage.setItem("sigma.auth.v1", JSON.stringify(authData));
  } catch (error) {
    console.error("Failed to store auth:", error);
  }
}
