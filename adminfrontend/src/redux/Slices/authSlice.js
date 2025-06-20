// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/admin/login", credentials);
      const { token, user, message } = response.data;

      localStorage.setItem("token", token);
console.log(response)
      return { user, message };
    } catch (error) {
       console.error(error)
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);


const initialState = {
  admin: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.admin = action.payload;
    })
    .addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;