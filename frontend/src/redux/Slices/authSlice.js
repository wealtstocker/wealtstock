import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

// Login Thunk
export const loginCustomer = createAsyncThunk(
  "auth/loginCustomer",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      console.log("response login ----", response);
      // Swal.fire({
      //   toast: true,
      //   position: "top-end",
      //   icon: "success",
      //   title: response.data.message || "Login successful",
      //   showConfirmButton: false,
      //   timer: 2000,
      //   timerProgressBar: true,
      // });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (err) {
      if (err.response?.status === 403) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Your account is inactive. Please contact support.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
        return rejectWithValue("Your account is inactive. Please contact support.");
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Login failed",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      console.error("Login Error:", err);
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Register Thunk
export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };
      const response = await axiosInstance.post(
        "/auth/register",
        formData,
        config
      );
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: response.data.message || "Registered successfully",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return response.data;
    } catch (error) {
      console.error("Registration Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.customer;
        localStorage.setItem("user", JSON.stringify(action.payload.customer));
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.customer;
        // localStorage.setItem("user", JSON.stringify(action.payload.customer));
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
