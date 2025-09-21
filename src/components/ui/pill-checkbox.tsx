import * as React from "react";
import { cn } from "@/lib/utils";

export type PillCheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: React.ReactNode;
  className?: string;
};

export const PillCheckbox: React.FC<PillCheckboxProps> = ({
  checked,
  onChange,
  label,
  className,
}) => {
  const [internal, setInternal] = React.useState(!!checked);
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? !!checked : internal;

  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
        isChecked
          ? "border-brand bg-brand/10 text-brand"
          : "border-brand/40 text-brand hover:bg-brand/5",
        className
      )}
      aria-pressed={isChecked}
    >
      <span
        className={cn(
          "inline-grid place-items-center size-4 rounded-full border",
          isChecked ? "bg-brand border-brand" : "border-brand/40"
        )}
        aria-hidden
      >
        {isChecked ? (
          <span className="text-white text-[10px] leading-none">✓</span>
        ) : null}
      </span>
      <span>{label}</span>
    </button>
  );
};

export default PillCheckbox;
