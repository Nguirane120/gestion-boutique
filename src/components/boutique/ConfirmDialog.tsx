import { AlertTriangle, Loader2 } from "lucide-react";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmer",
  isLoading = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="px-6 pt-6 flex flex-col items-center text-center gap-3">
          <div className="bg-red-50 p-3 rounded-full">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{message}</p>
        </div>

        <div className="flex items-center gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
