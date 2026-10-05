"use client";

import { useToastStore } from "@/store/useToastStore";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-2xl border border-outline-variant/40 text-on-surface animate-in fade-in slide-in-from-bottom-3 duration-300"
            style={{
              boxShadow: "0 12px 30px -4px rgba(13, 28, 47, 0.15), 0 4px 12px -2px rgba(13, 28, 47, 0.08)",
            }}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                isSuccess
                  ? "bg-secondary-container text-on-secondary-container"
                  : isError
                  ? "bg-error-container text-on-error-container"
                  : isWarning
                  ? "bg-amber-100 text-amber-800"
                  : "bg-primary-container text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSuccess
                  ? "check_circle"
                  : isError
                  ? "error"
                  : isWarning
                  ? "warning"
                  : "info"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-label-md text-label-md font-bold text-on-surface leading-snug">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
