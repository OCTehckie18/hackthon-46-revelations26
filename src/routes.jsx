import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Student Pages
import HomePage from "./pages/Student/HomePage";
import VendorMenuPage from "./pages/Student/VendorMenuPage";
import CartPage from "./pages/Student/CartPage";
import CheckoutPage from "./pages/Student/CheckoutPage";
import OrderTrackingPage from "./pages/Student/OrderTrackingPage";
import OrderHistoryPage from "./pages/Student/OrderHistoryPage";
import ProfilePage from "./pages/Student/ProfilePage";

// Vendor Pages
import VendorLogin from "./pages/Vendor/VendorLogin";
import VendorDashboardPage from "./pages/Vendor/VendorDashboardPage";
import MenuManagementPage from "./pages/Vendor/MenuManagementPage";
import OrderManagementPage from "./pages/Vendor/OrderManagementPage";
import AnalyticsPage from "./pages/Vendor/AnalyticsPage";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import OTPVerification from "./pages/Auth/OTPVerification";

// Common Components
import Header from "./components/common/Header";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

const StudentRoute = ({ children }) => (
  <ProtectedRoute role="student">
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  </ProtectedRoute>
);

const VendorRoute = ({ children }) => (
  <ProtectedRoute role="vendor">
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">{children}</main>
    </div>
  </ProtectedRoute>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/vendor/login" element={<VendorLogin />} />

      {/* Student Routes */}
      <Route
        path="/"
        element={
          <StudentRoute>
            <HomePage />
          </StudentRoute>
        }
      />
      <Route
        path="/vendor/:vendorId"
        element={
          <StudentRoute>
            <VendorMenuPage />
          </StudentRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <StudentRoute>
            <CartPage />
          </StudentRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <StudentRoute>
            <CheckoutPage />
          </StudentRoute>
        }
      />
      <Route
        path="/track-order/:orderId"
        element={
          <StudentRoute>
            <OrderTrackingPage />
          </StudentRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <StudentRoute>
            <OrderHistoryPage />
          </StudentRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <StudentRoute>
            <ProfilePage />
          </StudentRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendor/dashboard"
        element={
          <VendorRoute>
            <VendorDashboardPage />
          </VendorRoute>
        }
      />
      <Route
        path="/vendor/menu"
        element={
          <VendorRoute>
            <MenuManagementPage />
          </VendorRoute>
        }
      />
      <Route
        path="/vendor/orders"
        element={
          <VendorRoute>
            <OrderManagementPage />
          </VendorRoute>
        }
      />
      <Route
        path="/vendor/analytics"
        element={
          <VendorRoute>
            <AnalyticsPage />
          </VendorRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
