// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { ArrowDown2 } from "iconsax-react";

// export type SelectOption = {
//   value: string;
//   label: string;
//   icon?: React.ReactNode;
// };

// export type SelectProps = {
//   value?: string;
//   onChange?: (value: string) => void;
//   options: SelectOption[];
//   placeholder?: string;
//   className?: string;
// };

// export const Select: React.FC<SelectProps> = ({
//   value,
//   onChange,
//   options,
//   placeholder,
//   className,
// }) => {
//   const [open, setOpen] = React.useState(false);
//   const selected = options.find((o) => o.value === value);
//   const containerRef = React.useRef<HTMLDivElement | null>(null);

//   React.useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!containerRef.current) return;
//       if (!containerRef.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div ref={containerRef} className={cn("relative", className)}>
//       <button
//         type="button"
//         className="w-full rounded-xl  bg-[#F5F5F5] px-[14px] py-[10px] text-left focus:outline-none"
//         onClick={() => setOpen((v) => !v)}
//       >
//         <div className="flex items-center justify-between gap-2">
//           <div className="flex items-center gap-2 overflow-hidden">
//             {selected?.icon ? (
//               <span className="shrink-0">{selected.icon}</span>
//             ) : null}
//             <span
//               className={cn(
//                 "text-sm",
//                 selected ? "text-neutral-900" : "text-neutral-400"
//               )}
//             >
//               {selected ? selected.label : placeholder || "Select..."}
//             </span>
//           </div>
//           <span className="text-neutral-500" aria-hidden>
//             <ArrowDown2 size={18} color="currentColor" />
//           </span>
//         </div>
//       </button>
//       {open ? (
//         <div className="absolute z-20 mt-2 w-full rounded-xl border border-neutral-200 bg-white p-1 shadow-lg">
//           <div className="max-h-56 overflow-auto">
//             {options.map((opt) => (
//               <button
//                 key={opt.value}
//                 type="button"
//                 onClick={() => {
//                   onChange?.(opt.value);
//                   setOpen(false);
//                 }}
//                 className={cn(
//                   "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100",
//                   value === opt.value && "bg-brand/10"
//                 )}
//               >
//                 {opt.icon ? <span className="shrink-0">{opt.icon}</span> : null}
//                 <span>{opt.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Select;

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown2 } from "iconsax-react";

export type SelectOption = {
  value: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
};

export type SelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
};

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* --- Trigger Button --- */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full rounded-full bg-[#F5F5F5] px-[14px] py-[10px] text-left text-[15px] flex items-center justify-between gap-2 ",
          " transition-colors duration-150"
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selected?.icon && (
            <span className="shrink-0 flex items-center">{selected.icon}</span>
          )}
          <span
            className={cn(
              "text-sm truncate",
              selected ? "text-neutral-900" : "text-neutral-400"
            )}
          >
            {selected ? selected.label : placeholder || "Select..."}
          </span>
        </div>

        <ArrowDown2
          size={18}
          color="#6B7280"
          className={cn(
            "transition-transform duration-150",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {/* --- Dropdown Menu --- */}
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-neutral-200 bg-[#F5F5F5] py-2">
          <div className="max-h-56 overflow-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-[95%] mx-auto items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white",
                  value === opt.value && "bg-white font-medium "
                )}
              >
                {opt.icon && (
                  <span className="shrink-0 flex items-center">{opt.icon}</span>
                )}
                <span className="text-[15px] text-[#262626] py-1 mb-1">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
