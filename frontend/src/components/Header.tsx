import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Droplets, Menu, X, Bell, BarChart3, Lightbulb } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

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
            <Droplets
              className="h-8 w-8 text-blue-300 dark:text-water-400"
              aria-hidden="true"
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
              {navItems.map((item) => {
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
            </nav>
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

            <nav
              className="space-y-2"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {navItems.map((item) => {
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
