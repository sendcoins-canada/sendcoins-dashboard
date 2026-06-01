import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "@/store";
import { showDanger } from "@/components/ui/toast";
import { useBalances } from "@/query/hooks/useBalances";

const VerifiedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const userSlice = useSelector((state: RootState) => state.user) as any;
  const userData = userSlice?.user?.data;
  const location = useLocation();
  const { data: balancesData } = useBalances();

  const accessToken = auth.token?.azer_token;

  const hasPin = userData?.isPinAvailable?.found === true;
  const isFiatRoute = location.pathname.includes("send-fiat");
  const hasFiatAccount = (balancesData?.data?.fiatAccounts?.length ?? 0) > 0;
  const needsPasscode = !!userData && !hasPin;
  const needsFiatAccount = isFiatRoute && balancesData && !hasFiatAccount;
  const shouldBlock = needsPasscode || needsFiatAccount;
  const toastShown = useRef(false);

  useEffect(() => {
    if (shouldBlock && !toastShown.current) {
      toastShown.current = true;
      if (needsPasscode) {
        showDanger("Please set up your passcode before making transactions.");
      } else if (needsFiatAccount) {
        showDanger("Please set up your fiat account first.");
      }
    }
  }, [shouldBlock, needsPasscode, needsFiatAccount]);

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

  if (needsPasscode) {
    return <Navigate to="/dashboard/home" replace />;
  }

  if (needsFiatAccount) {
    return <Navigate to="/dashboard/setup-fiat" replace />;
  }

  return <>{children}</>;
};

export default VerifiedRoute;
