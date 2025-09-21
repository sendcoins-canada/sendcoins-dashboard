import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/slice";
import authReducer from "./auth/slice"
import registrationReducer from "./registration/slice"

export const store = configureStore({
  reducer: {
    user: userReducer,
     auth: authReducer,
     registration: registrationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
