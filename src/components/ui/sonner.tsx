import React, { useSyncExternalStore } from "react";
import { CloseCircle, TickCircle } from "iconsax-react";

/**
 * Custom toast system — replaces Sonner which breaks in Vite dev mode
 * with React 19 (flushSync not available on pre-bundled react-dom).
 * Uses useSyncExternalStore for reliable state synchronization.
 */

type ToastType = "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

// Global singleton store — survives Vite HMR module reloads.
// Without this, HMR creates separate module instances for toast producers
// and the Toaster consumer, breaking the subscription.
interface ToastStore {
  toasts: Toast[];
  nextId: number;
  listeners: Set<() => void>;
}

const STORE_KEY = "__sendcoins_toast_store__";

function getStore(): ToastStore {
  const w = window as unknown as Record<string, ToastStore>;
  if (!w[STORE_KEY]) {
    w[STORE_KEY] = { toasts: [], nextId: 1, listeners: new Set() };
  }
  return w[STORE_KEY];
}

function emitChange() {
  getStore().listeners.forEach((fn) => fn());
}

function addToast(message: string, type: ToastType, duration = 4000) {
  const store = getStore();
  const id = store.nextId++;
  store.toasts = [...store.toasts, { id, message, type, duration }];
  emitChange();
  setTimeout(() => {
    const s = getStore();
    s.toasts = s.toasts.filter((t) => t.id !== id);
    emitChange();
  }, duration);
  return id;
}

// Public API
export const toast = {
  success: (msg: string) => addToast(msg, "success", 3000),
  error: (msg: string) => addToast(msg, "error", 4000),
  warning: (msg: string) => addToast(msg, "warning", 3000),
};

// Store interface for useSyncExternalStore
const toastStore = {
  subscribe(listener: () => void) {
    const store = getStore();
    store.listeners.add(listener);
    return () => { store.listeners.delete(listener); };
  },
  getSnapshot() {
    return getStore().toasts;
  },
};

function useToasts() {
  return useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot);
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: (
    <div className="p-1 flex items-center justify-center rounded-full bg-green-500">
      <TickCircle size="18" color="white" />
    </div>
  ),
  error: (
    <div className="p-1 flex items-center justify-center rounded-full bg-[#FF383C]">
      <CloseCircle size="18" color="white" />
    </div>
  ),
  warning: (
    <div className="p-1 flex items-center justify-center rounded-full bg-yellow-500">
      <CloseCircle size="18" color="white" />
    </div>
  ),
};

const bgMap: Record<ToastType, string> = {
  success: "bg-green-50 text-green-700",
  error: "bg-[#FFE5E6] text-[#FF383C]",
  warning: "bg-yellow-50 text-yellow-800",
};

export function Toaster() {
  const active = useToasts();

  if (active.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      {active.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-lg animate-in fade-in slide-in-from-top-2 ${bgMap[t.type]}`}
          style={{ animation: "fadeSlideIn 0.2s ease-out" }}
        >
          {iconMap[t.type]}
          <span>{t.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
