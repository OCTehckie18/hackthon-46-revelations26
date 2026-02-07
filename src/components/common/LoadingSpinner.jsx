import React from "react";
import { Loader2, Clock, Coffee } from "lucide-react";

export const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  fullScreen = false,
  text = "",
  showIcon = true,
  className = "",
}) => {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const variantClasses = {
    primary: "border-blue-500 border-t-transparent",
    secondary: "border-green-500 border-t-transparent",
    light: "border-white border-t-transparent",
    dark: "border-gray-800 border-t-transparent",
  };

  const spinner = (
    <div className={`relative ${sizeClasses[size]}`}>
      <div
        className={`absolute inset-0 border-2 rounded-full animate-spin ${variantClasses[variant]}`}
      />
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock
            className={`${sizeClasses[size]} ${variant === "light" ? "text-white" : "text-gray-400"}`}
          />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="relative">
          {spinner}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <Coffee className="w-8 h-8 text-blue-500 animate-bounce" />
          </div>
        </div>
        {text && (
          <p className="mt-8 text-lg text-gray-600 font-medium animate-pulse">
            {text}
          </p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          Preparing your experience...
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {spinner}
      {text && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const LoadingSkeleton = ({
  type = "card",
  count = 1,
  className = "",
}) => {
  const skeletons = [];

  switch (type) {
    case "card":
      for (let i = 0; i < count; i++) {
        skeletons.push(
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>,
        );
      }
      break;

    case "list":
      for (let i = 0; i < count; i++) {
        skeletons.push(
          <div key={i} className="flex items-center space-x-3 p-3 border-b">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>,
        );
      }
      break;

    case "table":
      for (let i = 0; i < count; i++) {
        skeletons.push(
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-16" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-32" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-24" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-20" />
            </td>
          </tr>,
        );
      }
      break;

    case "text":
      for (let i = 0; i < count; i++) {
        skeletons.push(
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>,
        );
      }
      break;

    default:
      skeletons.push(
        <div
          key={0}
          className="w-full h-full bg-gray-200 animate-pulse rounded"
        />,
      );
  }

  return <div className={className}>{skeletons}</div>;
};

export const LoadingOverlay = ({ children, isLoading, message }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
        <LoadingSpinner size="lg" />
        {message && <p className="mt-3 text-gray-600">{message}</p>}
      </div>
      <div className="opacity-50 pointer-events-none">{children}</div>
    </div>
  );
};

export const LoadingButton = ({
  children,
  isLoading,
  loadingText = "Loading...",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`inline-flex items-center justify-center ${props.className || ""} ${
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const ProgressBar = ({ progress, label, showPercentage = true }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
