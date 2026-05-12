// src/store/slices/registrationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  email: string;
  authHash: string;
  country: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

const initialState: RegistrationState = {
  email: "",
  authHash: "",
  country: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  password: "",
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setAuthHash(state, action: PayloadAction<string>) {
      state.authHash = action.payload;
    },
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setPhoneNumber(state, action: PayloadAction<string>) {
      state.phoneNumber = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    resetRegistration() {
      return initialState;
    },
  },
});

export const {
  setEmail,
  setAuthHash,
  setCountry,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setPassword,
  resetRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;
