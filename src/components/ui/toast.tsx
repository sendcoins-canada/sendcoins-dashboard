import { toast } from "@/components/ui/sonner";

export const showSuccess = (message: string) => toast.success(message);
export const showWarning = (message: string) => toast.warning(message);
export const showDanger = (message: string) => toast.error(message);
