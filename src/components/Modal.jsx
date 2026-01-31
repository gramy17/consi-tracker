import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md ui-card bg-[#0f0f0f] shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="ui-h2">{title}</h2>
          <button
            onClick={onClose}
            className="ui-icon-btn -mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="ui-divider" />

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
