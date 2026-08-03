"use client";

import Button from "../../common/Button";

interface DeleteModalProps {
  open: boolean;
  loading?: boolean;
  title?: string;
  description?: string;

  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  open,
  loading = false,
  title = "Delete Product",
  description = "Are you sure you want to delete this product?",
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-xl bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-3 text-slate-400">
          {description}
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}