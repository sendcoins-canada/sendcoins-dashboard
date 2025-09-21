import { toast } from "sonner";

export const showSuccess = (message: string) =>
  toast.success(message, {
    className: "rounded-full bg-green-50 text-green-700",
    duration: 3000,
  });

export const showWarning = (message: string) =>
  toast(message, {
    className: "rounded-full bg-yellow-50 text-yellow-800",
    duration: 3000,
  });

export const showDanger = (message: string) =>
  toast.error(message, {
    className: "rounded-full bg-red-50 text-red-600",
    duration: 4000,
  });
