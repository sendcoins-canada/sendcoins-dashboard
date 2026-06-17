import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Header from "@/components/onboarding/shared/Header";
import { ArrowLeft2, ShieldTick } from "iconsax-react";
import type { RootState, AppDispatch } from "@/store";
import { updateUserProfile, getUnifiedKycConfig } from "@/api/kyc";
import type { UnifiedKycConfigResponse } from "@/api/kyc";
import { showSuccess, showDanger } from "@/components/ui/toast";
import { fetchUser } from "@/store/user/asyncRequests/fetchUser";
import Modal from "@/components/ui/Modal";

const CTA = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token?.azer_token);

  // KYC config state
  const [kycConfig, setKycConfig] = useState<UnifiedKycConfigResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // BVN modal state
  const [isBvnModalOpen, setIsBvnModalOpen] = useState(false);
  const [bvnInput, setBvnInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // User data from Redux
  const userSlice = useSelector((state: RootState) => state.user) as any;
  const userData = userSlice?.user?.data;
  const hasPin = userData?.isPinAvailable?.found === true;
  // Check verified from both Redux (cached) and KYC config response (fresh from backend)
  const isVerified = userData?.verified === true || kycConfig?.verified === true;
  const isBvnMissing = !userData?.bvn || userData?.bvn === "";

  // Country can come from KYC config (authoritative) or user data (fallback while loading)
  const userCountry = (userData?.country || "").toLowerCase().trim();
  const isNigerian =
    kycConfig?.kyc_provider === "crayfi" ||
    (!kycConfig && (userCountry === "nigeria" || userCountry === "ng"));
  const isDojah = kycConfig?.kyc_provider === "dojah";

  // Fetch unified KYC config on mount
  useEffect(() => {
    const loadConfig = async () => {
      if (!token) return;
      try {
        setLoadingConfig(true);
        const res = await getUnifiedKycConfig(token);
        if (res.success) {
          setKycConfig(res);
        }
      } catch (err) {
        console.error("Error loading KYC config", err);
      } finally {
        setLoadingConfig(false);
      }
    };
    loadConfig();
  }, [token]);

  // Launch Dojah widget for international users
  const handleDojahVerify = () => {
    if (!kycConfig?.config) {
      showDanger("Verification is not ready yet. Please try again in a moment.");
      return;
    }

    const cfg = kycConfig.config;

    const connect = new Connect({
      app_id: cfg.app_id,
      p_key: cfg.p_key,
      type: cfg.type || "custom",
      config: { widget_id: cfg.widget_id },
      metadata: cfg.metadata as unknown as Record<string, string>,
      user_data: cfg.user_data as unknown as Record<string, string>,
      onSuccess: (response: unknown) => {
        console.log("[Dojah] Verification success:", response);
        showSuccess("Identity verification completed!");
        dispatch(fetchUser());
        navigate("/dashboard/home");
      },
      onError: (error: unknown) => {
        console.error("[Dojah] Verification error:", error);
        showDanger("Verification failed. Please try again.");
      },
      onClose: () => {
        console.log("[Dojah] Widget closed");
      },
    });

    connect.setup();
    connect.open();
  };

  // BVN submit for Nigerian users
  const handleBvnSubmit = async () => {
    if (bvnInput.length !== 11) {
      showDanger("Please enter a valid 11-digit BVN");
      return;
    }

    if (!token) {
      showDanger("Session expired. Please login again.");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateUserProfile({
        token,
        bvn: bvnInput,
      });

      if (response.data?.isSuccess || response.isSuccess === true) {
        showSuccess("BVN linked successfully!");
        setIsBvnModalOpen(false);
        setBvnInput("");
        dispatch(fetchUser());
      } else {
        throw new Error(response.message || "Failed to update BVN");
      }
    } catch (error: any) {
      console.error("BVN Update Error:", error);
      showDanger(
        error.response?.data?.message || "An error occurred during verification."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col">
        <div
          className="flex items-center cursor-pointer border rounded-full w-fit md:ml-28 ml-6 justify-center py-2 px-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft2 size="16" color="black" />
          <p className="text-sm font-semibold">Back</p>
        </div>

        <div className="flex flex-col items-center text-center mt-12 px-4">
          <div className="bg-[#480355] text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <ShieldTick size="32" color="#FFFFFF" variant="Bold" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 font-sans">
            Let's Get You Verified & Secure
          </h1>
          <p className="text-gray-500 max-w-md mb-8">
            Just a quick ID check and passcode setup, and you'll be ready to
            send and receive money in minutes
          </p>

          <div className="w-full max-w-md flex flex-col gap-4">
            {/* BVN — only for Nigerian users who haven't linked it */}
            {isNigerian && isBvnMissing && (
              <button
                onClick={() => setIsBvnModalOpen(true)}
                className="w-full flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-purple-900">
                    Link your BVN
                  </h3>
                  <p className="text-sm text-purple-700">
                    Securely link your Bank Verification Number to unlock higher
                    transaction limits.
                  </p>
                </div>
                <ChevronRight className="text-purple-400" />
              </button>
            )}

            {/* Passcode — show for all users who don't have one */}
            {!hasPin && (
              <button
                onClick={() => navigate("/setup-passcode")}
                className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold">Create a passcode</h3>
                  <p className="text-sm text-gray-500">
                    Set a secure 4 digit code to keep your account safe and your
                    transfers protected.
                  </p>
                </div>
                <ChevronRight className="text-gray-400" />
              </button>
            )}

            {/* KYC — for international users (Dojah) who aren't verified */}
            {!isNigerian && !isVerified && (
              <button
                onClick={handleDojahVerify}
                disabled={loadingConfig || !kycConfig?.config}
                className="w-full flex items-center justify-between bg-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="text-left">
                  <h3 className="font-semibold">Verify your identity</h3>
                  <p className="text-sm text-gray-500">
                    {loadingConfig
                      ? "Preparing verification, please wait..."
                      : "Upload a government-issued ID and take a quick selfie to verify your identity."}
                  </p>
                </div>
                <ChevronRight className="text-gray-400" />
              </button>
            )}
          </div>

          <Button
            variant="primary"
            className="mt-10 bg-[#0647F7] cursor-pointer text-white px-6 py-2 rounded-full"
            onClick={() => navigate("/dashboard/home")}
          >
            I'll do this later
          </Button>
        </div>

        {/* BVN Modal */}
        <Modal
          open={isBvnModalOpen}
          onOpenChange={setIsBvnModalOpen}
          showCloseIcon
        >
          <div className="p-6 flex flex-col items-center">
            <div className="bg-[#FDF2FA] p-3 rounded-full mb-4">
              <ShieldTick size="32" color="#480355" variant="Bold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verify your BVN</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Linking your BVN allows us to verify your identity and increase
              your limits.
            </p>

            <input
              type="text"
              maxLength={11}
              value={bvnInput}
              onChange={(e) => setBvnInput(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 11-digit BVN"
              className="w-full p-4 bg-gray-100 rounded-xl outline-none text-center text-lg tracking-[0.2em] font-bold border-2 border-transparent focus:border-[#0647F7] transition-all"
            />

            <Button
              className="w-full mt-6 py-7 bg-[#0647F7] hover:bg-[#0539c5] rounded-full text-white font-bold transition-all"
              onClick={handleBvnSubmit}
              disabled={isUpdating || bvnInput.length !== 11}
            >
              {isUpdating ? "Processing..." : "Link BVN"}
            </Button>

            <p className="mt-4 text-[10px] text-gray-400 text-center">
              Dial <span className="font-bold text-gray-600">*565*0#</span> on
              your registered line to find your BVN.
            </p>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CTA;
