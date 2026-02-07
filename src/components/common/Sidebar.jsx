import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Menu,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Package,
  Clock,
  TrendingUp,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Home,
  Calendar,
  Star,
  Wallet,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Sidebar = ({
  variant = "student",
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const sidebarOpen = isControlled ? controlledIsOpen : isOpen;

  // Student sidebar items
  const studentItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      badge: null,
    },
    {
      title: "Browse Vendors",
      icon: ShoppingBag,
      path: "/vendors",
      badge: null,
    },
    {
      title: "My Orders",
      icon: Package,
      path: "/orders",
      badge: "3",
    },
    {
      title: "Order Tracking",
      icon: Clock,
      path: "/tracking",
      badge: null,
    },
    {
      title: "Favorites",
      icon: Star,
      path: "/favorites",
      badge: "12",
    },
    {
      title: "Wallet",
      icon: Wallet,
      path: "/wallet",
      badge: null,
    },
    {
      title: "Schedule",
      icon: Calendar,
      path: "/schedule",
      badge: null,
    },
  ];

  // Vendor sidebar items
  const vendorItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/vendor/dashboard",
      badge: null,
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      path: "/vendor/orders",
      badge: "15",
    },
    {
      title: "Menu Management",
      icon: Menu,
      path: "/vendor/menu",
      badge: null,
    },
    {
      title: "Customer Reviews",
      icon: Users,
      path: "/vendor/reviews",
      badge: "24",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/vendor/analytics",
      badge: null,
    },
    {
      title: "Performance",
      icon: TrendingUp,
      path: "/vendor/performance",
      badge: null,
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/vendor/settings",
      badge: null,
    },
  ];

  const bottomItems = [
    {
      title: "Notifications",
      icon: Bell,
      path: variant === "student" ? "/notifications" : "/vendor/notifications",
      badge: "5",
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      path: "/help",
      badge: null,
    },
  ];

  const items = variant === "student" ? studentItems : vendorItems;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle(!sidebarOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest(".sidebar-container")) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // User stats based on role
  const userStats = {
    student: {
      orders: 12,
      rating: 4.8,
      saved: 50,
    },
    vendor: {
      orders: 156,
      rating: 4.5,
      revenue: "₹25,400",
    },
  };

  const stats = userStats[variant];

  const sidebarContent = (
    <aside
      className={`
        sidebar-container
        flex flex-col
        bg-gradient-to-b from-gray-900 to-gray-800
        text-white
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-64" : "w-20"}
        h-screen
        fixed left-0 top-0
        z-40
        overflow-hidden
        shadow-2xl
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold">CampusPreOrder</h2>
                <p className="text-xs text-gray-400">Skip the queue</p>
              </div>
            )}
          </Link>

          <button
            onClick={handleToggle}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors shrink-0"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Profile */}
        {sidebarOpen && user && (
          <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{user.name}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {variant === "student" ? "Student" : "Vendor"}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold">{stats.orders}</div>
                <div className="text-xs text-gray-400">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stats.rating}</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stats.saved}</div>
                <div className="text-xs text-gray-400">
                  {variant === "student" ? "Saved" : "Revenue"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
            {sidebarOpen ? "Main Menu" : ""}
          </p>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.title}
                to={item.path}
                className={`
                  flex items-center space-x-3
                  px-3 py-3
                  rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg"
                      : "hover:bg-gray-700/50 text-gray-300"
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                {sidebarOpen && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 px-4 space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-2">
            {sidebarOpen ? "Support" : ""}
          </p>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.title}
                to={item.path}
                className={`
                  flex items-center space-x-3
                  px-3 py-3
                  rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg"
                      : "hover:bg-gray-700/50 text-gray-300"
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                {sidebarOpen && <span className="flex-1">{item.title}</span>}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center space-x-3
              px-3 py-3
              rounded-lg
              text-red-400
              hover:bg-red-500/10
              transition-all duration-200
              mt-4
            "
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="flex-1 text-left">Logout</span>}
          </button>
        </div>
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Upgrade to Pro</p>
                <p className="text-xs text-gray-400">Get advanced features</p>
              </div>
            </div>
            <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </aside>
  );

  // Mobile sidebar toggle button
  const mobileToggleButton = (
    <button
      onClick={handleMobileToggle}
      className="
        lg:hidden
        fixed top-4 left-4
        z-50
        p-2
        bg-gray-900 text-white
        rounded-lg
        shadow-lg
      "
      aria-label="Toggle sidebar"
    >
      <Menu className="w-6 h-6" />
    </button>
  );

  return (
    <>
      {mobileToggleButton}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          lg:hidden
          fixed inset-y-0 left-0
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </div>

      {/* Spacer for desktop sidebar */}
      <div className={`hidden lg:block ${sidebarOpen ? "w-64" : "w-20"}`} />

      {/* Spacer for mobile toggle button */}
      <div className="lg:hidden h-16" />
    </>
  );
};

// HOC for pages that need sidebar
export const withSidebar = (WrappedComponent, variant = "student") => {
  return function WithSidebarComponent(props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          variant={variant}
          isOpen={isSidebarOpen}
          onToggle={setIsSidebarOpen}
        />
        <main
          className={`
            flex-1
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "lg:ml-64" : "lg:ml-20"}
          `}
        >
          <WrappedComponent {...props} />
        </main>
      </div>
    );
  };
};

export default Sidebar;
