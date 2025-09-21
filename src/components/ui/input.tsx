import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, startIcon, endIcon, isPassword, type = "text", ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPwd = isPassword || type === "password";
    const inputType = isPwd ? (showPassword ? "text" : "password") : type;

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full  bg-[#F5F5F5] px-[14px] py-[10px] focus-within:ring-1 focus-within:ring-[#57B5FF] focus-within:bg-white",
          className
        )}
      >
        {startIcon ? (
          <span className="text-neutral-500 shrink-0">{startIcon}</span>
        ) : null}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full outline-none placeholder:text-neutral-400 text-sm",
            startIcon ? "pl-0" : "",
            endIcon || isPwd ? "pr-0" : ""
          )}
          {...props}
        />
        {isPwd ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <span aria-hidden><EyeSlash size="16" color="black"/></span>
            ) : (
              <span aria-hidden><Eye size="16" color="black"/></span>
            )}
          </button>
        ) : endIcon ? (
          <span className="text-neutral-500">{endIcon}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
