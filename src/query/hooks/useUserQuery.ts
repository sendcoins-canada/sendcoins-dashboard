import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "@/store/user/slice";
import type { User } from "@/types/user";

async function fetchUserApi(id: string): Promise<User> {
  // mirror the thunk mock for now
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

export function useUserQuery(id: string, enabled = true) {
  const dispatch = useDispatch();
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserApi(id),
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    }
  }, [query.data, dispatch]);

  return query;
}
