import axios, { AxiosInstance, AxiosError } from "axios";
import { User } from "../context/AuthContext";
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from "../constants/config";

interface AuthResponse {
  token: string;
  user: User;
}

// Create an Axios instance for API calls
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Optionally redirect to login
    }
    return Promise.reject(error);
  },
);

/**
 * Exchange Google OAuth token with backend
 * Backend should verify the Google token and return an app-specific token
 */
export const exchangeTokenWithBackend = async (
  googleToken: string,
): Promise<{ data: AuthResponse }> => {
  try {
    const response = await apiClient.post<AuthResponse>("/login", {
      token: googleToken,
    });
    return { data: response.data };
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/profile");
  return response.data;
};

/**
 * Logout - invalidate token on backend
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

/**
 * Refresh token if needed
 */
export const refreshToken = async (): Promise<string> => {
  const response = await apiClient.post<{ token: string }>("/auth/refresh");
  return response.data.token;
};

export default apiClient;
