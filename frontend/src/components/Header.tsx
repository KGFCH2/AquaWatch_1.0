import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  BarChart3,
  Lightbulb,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onMobileMenuToggle,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/" },
    {
      id: "solutions",
      label: "Solutions",
      icon: Lightbulb,
      path: "/solutions",
    },
    { id: "alerts", label: "Alerts", icon: Bell, path: "/alerts" },
  ];

  // Add admin-only navigation items
  const adminNavItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: BarChart3, path: "/" },
    {
      id: "admin-users",
      label: "User Management",
      icon: Shield,
      path: "/admin/users",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      // Reload the page to reset the app state
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  const getUserDisplayInfo = () => {
    if (isAdmin && userData) {
      return {
        name: `Admin (${(userData as any).id})`,
        subtitle: "Administrator",
        icon: Shield,
      };
    } else if (userData) {
      return {
        name: (userData as any).email || "User",
        subtitle: (userData as any).state || "User Account",
        icon: User,
      };
    }
    return { name: "User", subtitle: "Account", icon: User };
  };

  const userInfo = getUserDisplayInfo();

  return (
    <header
      className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-slate-900 dark:to-slate-800 text-white shadow-xl transition-colors duration-300"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg px-2 py-1"
            aria-label="Go to AquaWatch home page"
          >
            <img
              src="/t2-removebg-preview.png"
              alt="AquaWatch Logo"
              className="h-10 w-9 object-cover"
            />
            <div>
              <h1 className="text-xl font-bold">AquaWatch</h1>
              <p className="text-xs text-blue-200 dark:text-water-300">
                Water Crisis Monitoring
              </p>
            </div>
          </button>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <div className="hidden sm:flex items-center justify-center">
              <ThemeToggle />
            </div>

            <nav
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {/* Show user navigation only for non-admin users */}
              {!isAdmin &&
                navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        active
                          ? "bg-blue-700 dark:bg-slate-700 text-white shadow-lg"
                          : "hover:bg-blue-800 dark:hover:bg-slate-700 text-blue-100 dark:text-slate-200"
                      }`}
                      aria-label={`Go to ${item.label}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

              {/* Admin Navigation */}
              {isAdmin &&
                adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                        active
                          ? "bg-orange-600 text-white shadow-lg"
                          : "hover:bg-orange-700 text-orange-100 border border-orange-600"
                      }`}
                      aria-label={`Go to ${item.label}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <userInfo.icon
                  className={`h-5 w-5 ${
                    isAdmin ? "text-orange-300" : "text-blue-300"
                  }`}
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{userInfo.name}</p>
                  <p className="text-xs text-blue-200 dark:text-slate-300">
                    {userInfo.subtitle}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <userInfo.icon
                        className={`h-8 w-8 ${
                          isAdmin ? "text-orange-500" : "text-blue-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {userInfo.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {userInfo.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-md hover:bg-blue-800 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={
              mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-700 dark:border-slate-600">
            {/* Mobile Theme Toggle */}
            <div className="mb-4 flex justify-center items-center sm:hidden">
              <ThemeToggle />
            </div>

            {/* Mobile User Info */}
            <div className="mb-4 px-4 py-3 bg-blue-800 dark:bg-slate-700 rounded-lg mx-4">
              <div className="flex items-center space-x-3">
                <userInfo.icon
                  className={`h-6 w-6 ${
                    isAdmin ? "text-orange-300" : "text-blue-300"
                  }`}
                />
                <div>
                  <p className="font-medium text-white">{userInfo.name}</p>
                  <p className="text-sm text-blue-200 dark:text-slate-300">
                    {userInfo.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <nav
              className="space-y-2 px-4"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Show user navigation only for non-admin users */}
              {!isAdmin &&
                navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                        active
                          ? "bg-blue-700 dark:bg-slate-700 text-white"
                          : "hover:bg-blue-800 dark:hover:bg-slate-700 text-blue-100 dark:text-slate-200"
                      }`}
                      aria-label={`Go to ${item.label}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  );
                })}

              {/* Mobile Admin Navigation */}
              {isAdmin &&
                adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                        active
                          ? "bg-orange-600 text-white"
                          : "hover:bg-orange-700 text-orange-100 border border-orange-600"
                      }`}
                      aria-label={`Go to ${item.label}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-left">{item.label}</span>
                    </button>
                  );
                })}

              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
