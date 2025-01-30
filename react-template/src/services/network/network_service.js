import axios from 'axios';
import {API_END_POINT} from "../../constants/constants.js";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_END_POINT, // Base URL from environment variables
    timeout: 10000, // Timeout in ms
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add Authorization header if token is available
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle token refresh if 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post(`${API_END_POINT}/auth/refresh`, { refreshToken });

                if (res.data?.accessToken) {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
                    return axiosInstance(originalRequest); // Retry the original request
                }
            } catch (refreshError) {
                // Redirect to login if refresh token fails
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

// Export the Axios instance
export default axiosInstance;
