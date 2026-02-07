import React, { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to your error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Send to analytics
    if (window.gtag) {
      window.gtag("event", "exception", {
        description: error.toString(),
        fatal: true,
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Reset any application state if needed
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-white" />
                <h1 className="text-2xl font-bold text-white">
                  Something went wrong
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  We're sorry, an unexpected error occurred
                </h2>
                <p className="text-gray-600 mb-6">
                  Our team has been notified. You can try refreshing the page or
                  return to the homepage.
                </p>

                {/* Error Details (Only in development) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">
                      Error Details:
                    </h3>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-60">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>

                <Link
                  to="/"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Go to Homepage</span>
                </Link>

                {this.props.onReport && (
                  <button
                    onClick={this.props.onReport}
                    className="flex-1 border border-red-500 text-red-600 py-3 px-6 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Report Issue
                  </button>
                )}
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">Need help?</h4>
                <p className="text-sm text-gray-600">
                  Contact support at{" "}
                  <a
                    href="mailto:support@campuspreorder.com"
                    className="text-blue-500 hover:underline"
                  >
                    support@campuspreorder.com
                  </a>{" "}
                  or call +91-9876543210
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Error ID: {Date.now()}-{Math.random().toString(36).substr(2, 9)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component for specific routes
export const withErrorBoundary = (WrappedComponent, errorHandlers = {}) => {
  return class extends Component {
    render() {
      return (
        <ErrorBoundary
          onReset={errorHandlers.onReset}
          onReport={errorHandlers.onReport}
        >
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};

// Error fallback component for Suspense
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Loading Error
      </h3>
      <p className="text-gray-600 text-center mb-4">
        Failed to load component. Please try again.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorBoundary;
