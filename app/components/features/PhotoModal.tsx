"use client";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

interface PhotoModalProps {
  photoUrl: string | null;
  onClose: () => void;
}

export function PhotoModal({ photoUrl, onClose }: PhotoModalProps): React.ReactNode {
  return (
    <Dialog open={photoUrl !== null} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/70 transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-olive-900">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
            aria-label="Close photo"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt="Task photo"
              className="max-h-[85vh] w-auto object-contain"
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
