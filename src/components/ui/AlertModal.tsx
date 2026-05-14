"use client";

import { Button } from "@/components/ui/Button";

type AlertModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  description: string;
  confirmText: string;
};

export function AlertModal({
  isOpen,
  onOpenChange,
  onConfirm,
  description,
  confirmText,
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <p className="mt-2 text-base text-slate-950">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
