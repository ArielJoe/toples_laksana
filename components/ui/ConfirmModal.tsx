"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border border-border bg-white">
        <DialogHeader className="p-8 text-center pb-2">
          <DialogTitle className="text-xl font-black text-text-primary tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium leading-relaxed text-text-secondary mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="p-6 pt-4 flex flex-row gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-xl font-bold h-12 bg-secondary-100/50 text-text-secondary hover:bg-secondary-100 hover:text-text-secondary border-none transition-all cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 rounded-xl font-black h-12 border-none cursor-pointer transition-all",
              variant === "danger" 
                ? "bg-red-100/50 text-red-600 hover:bg-red-100 hover:text-red-600!" 
                : "bg-primary-100/50 text-primary-600 hover:bg-primary-100 hover:text-primary-600!"
            )}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
