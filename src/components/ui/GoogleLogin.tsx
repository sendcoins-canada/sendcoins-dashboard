import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button"; // your styled button component
// import { FcGoogle } from "react-icons/fc"
import Google from "@/assets/Google.svg"

const GoogleLoginButton = ({ onSuccess, onError }: any) => {
  const login = useGoogleLogin({
    //  flow: "auth-code",
    onSuccess,
    onError,
  });

  return (
    <Button
      onClick={() => login()}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border border-[#E5E7EB] text-[#434343] font-bold cursor-pointer"
    >
      {/* <Google /> */}
      <img src={Google} alt="Google icon" className="w-4 h-4" />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
