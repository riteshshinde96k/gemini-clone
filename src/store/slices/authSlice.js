import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  otpSent: false,
  phoneNumber: '',
  countryCode: '',
  countries: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.otpSent = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.otpSent = false;
      state.phoneNumber = '';
      state.countryCode = '';
    },
    clearAuthState: (state) => {
      state.isLoading = false;
      state.otpSent = false;
    },
  },
});

export const {
  setLoading,
  setCountries,
  setPhoneNumber,
  setCountryCode,
  setOtpSent,
  loginSuccess,
  logout,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
