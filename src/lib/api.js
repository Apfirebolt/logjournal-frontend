import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';

// prod - https://journal-api.softgenie.org/

// Use environment variable for production, fallback to localhost for development
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://journal-api.softgenie.org/api';

const httpClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available
httpClient.interceptors.request.use(
  (config) => {
    const token = Cookie.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Global Error Handling & Status Triage)
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Network Connection Error (Server Down / No Internet)
    if (!error.response) {
      console.error('[Network Error] Unable to connect to the FastAPI backend.');
      toast.error('Network error: Unable to reach the server. Please check if the backend is running.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const errorMessage = typeof data?.detail === 'string' 
      ? data.detail 
      : (data?.detail?.[0]?.msg || error.message);

    switch (status) {
      case 401:
        // Unauthorized: Token expired or invalid
        console.warn('[Auth Error 401] Unauthorized session. Cleaning up cookies and redirecting.');
        Cookie.remove('token');
        
        // Prevent infinite loops if already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please sign in again.');
          window.location.href = '/login';
        }
        break;

      case 403:
        // Forbidden: User lacks permissions for this resource
        console.warn(`[Forbidden 403]: ${errorMessage}`);
        toast.error(errorMessage || 'Access denied. You do not have permission to perform this action.');
        break;

      case 404:
        // Not Found (Handled gracefully per component, but logged)
        console.warn(`[Not Found 404]: ${error.config?.url}`);
        break;

      case 422:
        // Unprocessable Entity (Validation Error)
        console.warn('[Validation Error 422]', errorMessage);
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server Errors
        console.error(`[Server Error ${status}]: Internal server issue.`);
        toast.error('A server error occurred. Please try again later.');
        break;

      default:
        console.error(`[Error ${status}]:`, errorMessage);
        break;
    }

    return Promise.reject(error);
  }
);

export default httpClient;