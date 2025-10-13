import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@/types/user";

// Example thunk; replace URL/logic with real API later
export const fetchUser = createAsyncThunk<User, string>(
  "user/fetchUser",
  async (userId: string) => {
    await new Promise((r) => setTimeout(r, 300));
     return {
      data: {
        azer_id: 1,
        first_name: "Olivia",
        last_name: "Rhye",
        profession: null,
        twitter: null,
        instagram: null,
        flag: null,
        country: "CA",
        user_email: "olivia@untitledui.com",
        live_secret_key: null,
        api_key: "abc123",
        isPinAvailable: true,
        verified: true,
        userID: userId,
        vibrate: "on",
        device_security: "enabled",
        sound: "on",
        activity_notify: "enabled",
        default_currency: "USD",
        profileUrl: "https://example.com/avatar.png",
        loginCount: "10",
        isSuccessful: true,
      },
    };
  }
);
