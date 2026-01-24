
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
  disabled?: boolean
};

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled
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
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "w-full rounded-full bg-[#F5F5F5] px-[14px] py-[10px] text-left text-[15px] flex items-center justify-between gap-2 transition-colors duration-150",
           disabled && "opacity-50 cursor-not-allowed"
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
      {open && !disabled && (
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

// src/components/ui/select.tsx
// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { ArrowDown2, Add } from "iconsax-react"; // Added 'Add' icon

// export type SelectOption = {
//   value: string;
//   label: string | React.ReactNode;
//   icon?: React.ReactNode;
// };

// export type SelectProps = {
//   value?: string;
//   onChange?: (value: string) => void;
//   options: SelectOption[];
//   placeholder?: string;
//   className?: string;
//   disabled?: boolean;
//   creatable?: boolean; // New Prop
// };

// export const Select: React.FC<SelectProps> = ({
//   value,
//   onChange,
//   options,
//   placeholder,
//   className,
//   disabled,
//   creatable = false,
// }) => {
//   const [open, setOpen] = React.useState(false);
//   const [query, setQuery] = React.useState(""); // State for search text
//   const containerRef = React.useRef<HTMLDivElement | null>(null);
//   const inputRef = React.useRef<HTMLInputElement | null>(null);

//   const selected = options.find((o) => o.value === value);

//   // Reset query when closing or when value changes externally
//   React.useEffect(() => {
//     if (!open) setQuery("");
//   }, [open]);

//   React.useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (!containerRef.current) return;
//       if (!containerRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Filter options based on query
//   const filteredOptions = options.filter((opt) => {
//     const labelString = typeof opt.label === "string" ? opt.label : opt.value;
//     return labelString.toLowerCase().includes(query.toLowerCase());
//   });

//   // Check if we need to show the "Create" option
//   const showCreate =
//     creatable &&
//     query.length > 0 &&
//     !filteredOptions.some((opt) => opt.value.toLowerCase() === query.toLowerCase());

//   return (
//     <div ref={containerRef} className={cn("relative", className)}>
//       {/* --- Trigger Area --- */}
//       <div
//         onClick={() => {
//           if (!disabled) {
//             setOpen(true);
//             setTimeout(() => inputRef.current?.focus(), 0);
//           }
//         }}
//         className={cn(
//           "w-full rounded-full bg-[#F5F5F5] px-[14px] py-[10px] text-left text-[15px] flex items-center justify-between gap-2 transition-colors duration-150 cursor-pointer",
//           disabled && "opacity-50 cursor-not-allowed",
//           open && "ring-2 ring-[#0052FF]/20 bg-white"
//         )}
//       >
//         <div className="flex items-center gap-2 overflow-hidden flex-1">
//           {/* Show Icon only if selected and not searching/typing */}
//           {!open && selected?.icon && (
//             <span className="shrink-0 flex items-center">{selected.icon}</span>
//           )}

//           {/* If open, show Input, otherwise show Label */}
//           {open ? (
//             <input
//               ref={inputRef}
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder={creatable ? "Search or create..." : "Search..."}
//               className="w-full bg-transparent outline-none text-sm text-neutral-900 placeholder:text-neutral-400"
//             />
//           ) : (
//             <span
//               className={cn(
//                 "text-sm truncate",
//                 selected ? "text-neutral-900" : "text-neutral-400"
//               )}
//             >
//               {selected ? selected.label : placeholder || "Select..."}
//             </span>
//           )}
//         </div>

//         <ArrowDown2
//           size={18}
//           color="#6B7280"
//           className={cn(
//             "transition-transform duration-150 shrink-0",
//             open ? "rotate-180" : ""
//           )}
//         />
//       </div>

//       {/* --- Dropdown Menu --- */}
//       {open && !disabled && (
//         <div className="absolute z-20 mt-1 w-full rounded-xl border border-neutral-200 bg-[#F5F5F5] py-2 shadow-lg">
//           <div className="max-h-56 overflow-auto py-1">
//             {/* Render Filtered Options */}
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((opt) => (
//                 <button
//                   key={opt.value}
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onChange?.(opt.value);
//                     setOpen(false);
//                   }}
//                   className={cn(
//                     "flex w-[95%] mx-auto items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white",
//                     value === opt.value && "bg-white font-medium"
//                   )}
//                 >
//                   {opt.icon && (
//                     <span className="shrink-0 flex items-center">{opt.icon}</span>
//                   )}
//                   <span className="text-[15px] text-[#262626] py-1">{opt.label}</span>
//                 </button>
//               ))
//             ) : !showCreate ? (
//                <div className="px-4 py-3 text-sm text-neutral-400 text-center">
//                  No results found
//                </div>
//             ) : null}

//             {/* Render "Create Option" if applicable */}
//             {showCreate && (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onChange?.(query); // Pass the raw query as the new value
//                   setOpen(false);
//                 }}
//                 className="flex w-[95%] mx-auto items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white text-[#0052FF]"
//               >
//                 <Add size="16" className="text-[#0052FF]" />
//                 <span className="font-medium">Use "{query}"</span>
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Select;