import { toast } from "sonner";
import { CloseCircle } from "iconsax-react";

export const showSuccess = (message: string) =>
  toast.success(message, {
    className: "rounded-full bg-green-50 text-green-700",
    duration: 3000,
    position: "top-center"
  });

export const showWarning = (message: string) =>
  toast(message, {
    className: "rounded-full bg-yellow-50 text-yellow-800",
    duration: 3000,
    position: "top-center"
  });


export const showDanger = (message: string) =>
  toast.error(message, {
    icon: (
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FF383C]">
        <CloseCircle size="18" color="white" />
      </div>
    ),
    className: `
      flex items-center gap-2 rounded-full 
      bg-[#FFE5E6] text-[#FF383C]
       w-fit !justify-start !items-center
    `,
    duration: 4000,    
    position: "top-center",
    style: {
      width: "fit-content",
      display: "flex", // ensure container uses flex
      alignItems: "center", // vertically centers icon + text
      justifyContent: "flex-start",
      borderRadius: "9999px",
      paddingTop: 8,
      paddingBottom: 8,
      
    },
  });
