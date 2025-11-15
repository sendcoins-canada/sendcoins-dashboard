import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { ArrowLeft2 } from "iconsax-react";
import { XIcon } from "lucide-react";

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
  showBackArrow?: boolean;
  onBack?: () => void;
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
  closeIconColor = "#8C8C8C",
  showBackArrow = false,
  onBack,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl w-[80%] md:w-full bg-white shadow-lg z-[70] ${className || ""}`}
        showCloseButton={false}
      >
        {/* Header with Back Arrow, Title, and Close Button */}
        {(showBackArrow || title || showCloseIcon) && (
          <div className="flex items-center justify-between w-full mb-4">
            {/* Back Arrow */}
            <div className="flex-1 flex justify-start">
              {showBackArrow && onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 border rounded-full transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft2 size="16" color="#262626" />
                </button>
              )}
            </div>

            {/* Title */}
            {title && (
              <div className="flex-1 flex justify-center">
                <h2 className="text-body-md-bold">{title}</h2>
              </div>
            )}

            {/* Close Button */}
            <div className="flex-1 flex justify-end">
              {showCloseIcon && (
                <DialogClose asChild>
                  <button
                    className="p-2 border hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <XIcon size="16" color={closeIconColor} />
                  </button>
                </DialogClose>
              )}
            </div>
          </div>
        )}

        {description && (
          <DialogDescription className="text-gray-500 mb-4">
            {description}
          </DialogDescription>
        )}

        <div>{children}</div>

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
