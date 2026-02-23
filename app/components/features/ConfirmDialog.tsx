"use client";

import { Dialog, DialogPanel, DialogBackdrop, DialogTitle } from "@headlessui/react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps): React.ReactNode {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-olive-900">
          <DialogTitle className="text-lg font-display font-semibold text-olive-900 dark:text-olive-50">
            {title}
          </DialogTitle>
          <p className="mt-2 text-sm text-olive-600 dark:text-olive-400">
            {message}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-olive-300 px-4 py-2 text-sm font-medium text-olive-700 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 dark:border-olive-600 dark:text-olive-300 dark:hover:bg-olive-800"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {confirmLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
