import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />,
    error: <XCircle className="w-6 h-6" strokeWidth={2.5} />,
    info: <Info className="w-6 h-6" strokeWidth={2.5} />,
  };

  const colors = {
    success: "bg-emerald-500 dark:bg-emerald-600",
    error: "bg-red-500 dark:bg-red-600",
    info: "bg-blue-500 dark:bg-blue-600",
  };

  return (
    <div className="fixed top-4 right-4 z-[200] animate-slide-in-right">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden min-w-[320px] max-w-md">
        <div className="flex items-start gap-4 p-4">
          <div
            className={`${colors[type]} text-white p-2 rounded-xl flex-shrink-0`}
          >
            {icons[type]}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
          </button>
        </div>
        <div
          className={`h-1 ${colors[type]} animate-progress`}
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;
