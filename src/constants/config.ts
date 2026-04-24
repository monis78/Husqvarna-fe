/**
 * Application Configuration Constants
 */

export const GOOGLE_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  "899670360561-b9bkpldeqkebrcoto5eeqeo0ciigqf40.apps.googleusercontent.com";

export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || `${BACKEND_URL}/api/v1`;

export const API_TIMEOUT = 30000; // 30 seconds

export const TOKEN_KEY = "authToken";
export const USER_KEY = "user";
