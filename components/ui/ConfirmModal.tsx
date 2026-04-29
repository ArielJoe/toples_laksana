"use client";

import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

/**
 * ConfirmModal
 * A premium reusable confirmation dialog with smooth animations.
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-2xl w-full max-w-sm relative shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        <div className="p-8 text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner",
            variant === "danger" ? "bg-red-50 text-red-500" : "bg-primary-50 text-primary-500"
          )}>
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {variant === "danger" ? "delete_forever" : "help"}
            </span>
          </div>

          <h3 className="text-xl font-black text-text-primary tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-text-secondary font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-muted hover:bg-secondary-50 transition-colors border-r border-border"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 py-5 text-[0.65rem] font-black uppercase tracking-[0.2em] transition-colors",
              variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-primary-600 hover:bg-primary-50"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
