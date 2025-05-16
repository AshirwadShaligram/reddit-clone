import { useDispatch } from "react-redux";
import { logout } from "../path/to/slice/authSlice"; // Adjust the path to match your file structure
import api from "./axiosInstance";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logoutUser = async () => {
    try {
      // Call your logout API endpoint
      const response = await api.post("/api/auth/logout", {
        withCredentials: true,
      });

      // Dispatch logout action to Redux store
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state even if the API call fails
      dispatch(logout());
    }
  };

  return logoutUser;
};
