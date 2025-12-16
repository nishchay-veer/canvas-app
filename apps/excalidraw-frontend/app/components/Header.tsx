"use client";
import { Menu, X, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // Reload to clear any user-specific state
    window.location.reload();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-md z-50 border-b border-gray-200/80 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-blue-600"
            >
              <path
                d="M5 8 L8 5 L15 12 L28 3 L30 5 L15 20 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <rect
                x="3"
                y="10"
                width="20"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span className="text-xl font-bold text-gray-900">Excalidraw</span>
            <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>Realtime</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/signin"
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-200">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/signin"
                  className="block text-gray-700 hover:text-gray-900 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
