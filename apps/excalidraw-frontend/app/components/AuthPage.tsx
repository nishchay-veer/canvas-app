"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";

interface AuthModalProps {
  isSignIn: boolean;
}

export default function AuthModal({
  isSignIn: initialIsSignIn,
}: AuthModalProps) {
  const router = useRouter();
  const [isSignInMode, setIsSignInMode] = useState(initialIsSignIn);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignInMode) {
        // Sign In
        const response = await axios.post(`${HTTP_URL}/signin`, {
          username: formData.username,
          password: formData.password,
        });

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to home or dashboard
        router.push("/");
      } else {
        // Sign Up
        if (!formData.name.trim()) {
          setError("Name is required");
          setIsLoading(false);
          return;
        }

        const response = await axios.post(`${HTTP_URL}/signup`, {
          name: formData.name,
          username: formData.username,
          password: formData.password,
        });

        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect to home or dashboard
        router.push("/");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignInMode(!isSignInMode);
    setError(null);
    setFormData({ name: "", username: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Content */}
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 128 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="128" height="128" rx="24" fill="#6965DB" />
              <path
                d="M44 94V34H84L64 54H84V94H44Z"
                fill="white"
                stroke="white"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
            {isSignInMode ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isSignInMode
              ? "Sign in to continue to Excalidraw"
              : "Start creating beautiful diagrams"}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignInMode && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6965DB] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6965DB] focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6965DB] focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>

            {isSignInMode && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-[#6965DB] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !formData.username || !formData.password}
              className="w-full py-3 bg-[#6965DB] text-white font-semibold rounded-lg hover:bg-[#5b57c9] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignInMode ? "Signing in..." : "Creating account..."}
                </>
              ) : isSignInMode ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignInMode
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#6965DB] font-medium hover:underline"
              disabled={isLoading}
            >
              {isSignInMode ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
