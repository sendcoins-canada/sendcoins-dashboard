import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";
import { showDanger } from "@/components/ui/toast";

const VerifiedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const userSlice = useSelector((state: RootState) => state.user) as any;
  const userData = userSlice?.user?.data;

  const accessToken = auth.token?.azer_token;

  const hasPin = userData?.isPinAvailable?.found === true;
  const shouldBlock = !!userData && !hasPin;
  const toastShown = useRef(false);

  useEffect(() => {
    if (shouldBlock && !toastShown.current) {
      toastShown.current = true;
      showDanger("Please set up your passcode before making transactions.");
    }
  }, [shouldBlock]);

  if (auth.loading) {
    return null;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Allow through if user data hasn't loaded yet (DashboardLayout will fetch it)
  if (!userData) {
    return <>{children}</>;
  }

  if (shouldBlock) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <>{children}</>;
};

export default VerifiedRoute;
