import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">Error</h3>
          <p className="text-red-700 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-red-700 underline hover:text-red-900"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
