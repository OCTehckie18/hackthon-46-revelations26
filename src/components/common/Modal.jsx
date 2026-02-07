import React, { useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = "",
  footer,
  icon,
  type = "default",
  preventScroll = true,
  animation = "fade",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, preventScroll]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closeOnEsc && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, closeOnEsc, isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    full: "max-w-full mx-4",
  };

  const animationClasses = {
    fade: "animate-fadeIn",
    slide: "animate-slideIn",
    scale: "animate-scaleIn",
  };

  const getIconByType = () => {
    if (icon) return icon;

    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${
            sizeClasses[size]
          } ${animationClasses[animation]} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div
              className={`flex items-center justify-between p-6 border-b ${
                type === "default" ? "border-gray-200" : "border-transparent"
              }`}
            >
              <div className="flex items-center space-x-3">
                {getIconByType()}
                {title && (
                  <h3
                    id="modal-title"
                    className="text-xl font-semibold text-gray-900"
                  >
                    {title}
                  </h3>
                )}
              </div>

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div
              className={`px-6 py-4 border-t border-gray-200 ${
                type === "default"
                  ? "bg-gray-50"
                  : type === "success"
                    ? "bg-green-50"
                    : type === "warning"
                      ? "bg-yellow-50"
                      : type === "error"
                        ? "bg-red-50"
                        : "bg-blue-50"
              }`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Alert Modal Component
export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  onConfirm,
  showCancel = false,
  cancelText = "Cancel",
  onCancel,
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex space-x-3 justify-end">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              type === "success"
                ? "bg-green-500 hover:bg-green-600"
                : type === "warning"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : type === "error"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Confirmation Modal Component
export const ConfirmModal = ({
  isOpen,
  onClose,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  type = "warning",
  destructive = false,
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      type={type}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleConfirm}
      showCancel={true}
    />
  );
};

// Loading Modal Component
export const LoadingModal = ({ isOpen, title = "Loading", message }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-gray-600 text-center">{message}</p>}
      </div>
    </Modal>
  );
};

// Form Modal Component
export const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  children,
  isLoading = false,
  size = "lg",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="submit"
            form="modal-form"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </span>
            ) : (
              submitText
            )}
          </button>
        </div>
      }
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default Modal;
