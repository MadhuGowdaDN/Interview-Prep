import axios from 'axios';

// Create base instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for secure HTTP-only cookies (refresh token)
});

// Request interceptor not needed since we are relying on HTTP-only cookies


// Response interceptor for automatic token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint 
                // Assumes backend relies on HTTP-only refresh token cookie to validate
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request (cookies will be automatically included)
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log user out forcefully
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
