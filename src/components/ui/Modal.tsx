import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import { CloseCircle } from "iconsax-react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  showCancel?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  showCloseIcon?: boolean;
  closeIconColor?: string;
};

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  showCancel = false,
  cancelLabel = "Cancel",
  onCancel,
  className,
  showCloseIcon = true,
  closeIconColor = "black",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogOverlay className="fixed inset-0 bg-[#111111]/20 backdrop-blur-sm z-40" />
      <DialogContent
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl w-[90%] md:w-full bg-white shadow-lg  ${className || ""}` } showCloseButton={false}
      >
        
        {/* ✅ Custom Close Icon */}
        {showCloseIcon && (
          <DialogClose asChild>
            <button
              data-custom
              className="absolute top-4 right-4 cursor-pointer transition bg-white p-2 rounded-full"
              aria-label="Close"
            >
              <CloseCircle size="16" color={closeIconColor} variant="Outline" />
            </button>
          </DialogClose>
        )}

        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-gray-500">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="mt-4">{children}</div>

        {showCancel && (
          <div className="flex justify-end mt-6">
            <DialogClose asChild>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                {cancelLabel}
              </button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
