import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  // No longer storing tokens in Redux state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = !!user;
      // We're no longer tracking tokens in the Redux store
      // They're handled by HTTP-only cookies
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // No need to clear tokens from Redux as they're not stored here
      // The HTTP-only cookies will be cleared by the server
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
