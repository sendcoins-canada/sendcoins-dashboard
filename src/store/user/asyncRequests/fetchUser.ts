import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

// Example thunk; replace URL/logic with real API later
export const fetchUser = createAsyncThunk<User, string>(
  "user/fetchUser",
  async (id: string) => {
    // placeholder: simulate an API response
    await new Promise((r) => setTimeout(r, 300));
    return {
      id,
      firstName: "Olivia",
      lastName: "Rhye",
      phoneNumber: "+11234567890",
      country: "CA",
      email: "olivia@untitledui.com",
      isEmailVerified: true,
    };
  }
);
