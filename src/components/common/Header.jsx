import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell, User, LogOut, Clock, Home } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart, setIsCartOpen, getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                CampusPreOrder
              </h1>
              <p className="text-xs text-gray-500">Skip the queue</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            {user?.role === "student" && (
              <>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
            {user?.role === "vendor" && (
              <>
                <Link
                  to="/vendor/dashboard"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/vendor/orders"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  Orders
                </Link>
                <Link
                  to="/vendor/analytics"
                  className="text-gray-600 hover:text-blue-500 transition-colors"
                >
                  Analytics
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button (for students) */}
            {user?.role === "student" && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>
            )}

            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="hidden md:inline text-gray-700 font-medium">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>

                  <Link
                    to={
                      user?.role === "student"
                        ? "/profile"
                        : "/vendor/dashboard"
                    }
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </Link>

                  {user?.role === "student" && (
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Order History
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
