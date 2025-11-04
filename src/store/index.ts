import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/slice";
import authReducer from "./auth/slice";
import registrationReducer from "./registration/slice";
import walletReducer from "./wallet/slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    registration: registrationReducer,
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
