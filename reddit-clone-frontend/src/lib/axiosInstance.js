import axios from "axios";
import store from "../store/store";
import { logout, setCredentials } from "@/store/slice/authSlice";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  // Include credentials to ensure cookies are sent with requests
  withCredentials: true,
});

// No need to manually add the Authorization header from cookies
// since we're using httpOnly cookies that will be automatically sent

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized - expired token)
    if (
      error.response?.status === 401 &&
      error.response?.data?.shouldRefresh === true &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Call the refresh endpoint using the same api instance
        // The httpOnly cookie will be automatically included
        const res = await api.post(
          `/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Update the Redux store with the user data if returned
        if (res.data.user) {
          store.dispatch(
            setCredentials({
              ...store.getState().auth,
              user: res.data.user,
            })
          );
        }

        // Retry the original request
        // The new cookies are already set by the server
        return api(originalRequest);
      } catch (e) {
        // If refresh fails, log the user out
        store.dispatch(logout());
        // No need to manually remove cookies, the backend will do that
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
