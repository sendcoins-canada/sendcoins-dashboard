
import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowDown2, SearchNormal1 } from "iconsax-react";

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
  disabled?: boolean;
  showSearch?: boolean;
};

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
  showSearch = true
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(""); 
  const selected = options.find((o) => o.value === value);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    return options.filter((opt) => {
      const labelText = typeof opt.label === 'string' ? opt.label : opt.value;
      return labelText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [options, searchTerm]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) 
        {
          setOpen(false);;
          setSearchTerm("")
        }
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
          {/* --- Search Input --- */}
          {showSearch && (
            <div className="px-3 pb-2 pt-1 border-b border-neutral-200 mb-1">
              <div className="relative flex items-center">
                <SearchNormal1 
                  size={16} 
                  className="absolute left-3 "
                  color="#262626" 
                />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={(e) => e.stopPropagation()} // Prevent closing dropdown
                />
              </div>
            </div>
          )}
          <div className="max-h-56 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
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
            ))
            ) : (
              <div className="text-center py-4 text-sm text-neutral-500">
                No results found
              </div>
            )
          }
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;

