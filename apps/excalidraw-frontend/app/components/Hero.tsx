"use client";

import { ArrowRight, PlusCircle, LogIn, Sparkles } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";

export default function Hero() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createSlug, setCreateSlug] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  const handleCreate = useCallback(async () => {
    const slug = createSlug.trim();
    if (!slug) {
      setError("Room slug is required");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please sign in to create a room");
      router.push("/signin");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await axios.post(
        `${API_BASE_URL}/create-room`,
        { slug },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setShowCreateModal(false);
      router.push(`/canvas/${slug}`);
    } catch (e) {
      setError("Failed to create room. Please try a different slug.");
    } finally {
      setIsSubmitting(false);
    }
  }, [createSlug, router]);

  const handleJoin = useCallback(async () => {
    const slug = joinSlug.trim();
    if (!slug) {
      setError("Room slug is required");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please sign in to join a room");
      router.push("/signin");
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      // Verify room exists before redirecting
      await axios.get(`${API_BASE_URL}/rooms/${slug}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setShowJoinModal(false);
      router.push(`/canvas/${slug}`);
    } catch (e) {
      setIsSubmitting(false);
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        setToastMessage("Room not found");
        setTimeout(() => setToastMessage(null), 3000);
      } else if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError("Authentication required. Please sign in again.");
        router.push("/signin");
      } else {
        setToastMessage("Unable to join the room. Please try again.");
        setTimeout(() => setToastMessage(null), 3000);
      }
      return;
    } finally {
      setIsSubmitting(false);
    }
  }, [joinSlug, router]);

  const closeModals = useCallback(() => {
    setShowCreateModal(false);
    setShowJoinModal(false);
    setError(null);
    setIsSubmitting(false);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.08),transparent_22%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_25%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 border border-gray-200 shadow-sm text-sm font-medium text-gray-700 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Live collaborative canvas</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Sketch, share, and collaborate
            <span className="text-blue-600"> in real time</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            A playful Excalidraw-inspired canvas with instant multiplayer.
            Create a room or join one and start drawing together.
          </p>
          {isAuthenticated ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowJoinModal(false);
                    setError(null);
                  }}
                  className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Create room</span>
                  <PlusCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setShowJoinModal(true);
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  className="px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Join room</span>
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Privacy-first • Works in your browser • Live collaboration
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => router.push("/signin")}
                  className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <span>Sign in to start</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Sign in to create or join rooms and start collaborating.
              </p>
            </>
          )}
        </div>

        <div className="mt-16">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.05),transparent_30%)]" />
            <div className="relative p-4 sm:p-8">
              <div className="aspect-video bg-[#f7f8fb] rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                <svg
                  viewBox="0 0 800 450"
                  className="w-full h-full p-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="50"
                    y="80"
                    width="200"
                    height="120"
                    rx="12"
                    stroke="#2563eb"
                    strokeWidth="3"
                    fill="#e8f0ff"
                  />
                  <text
                    x="150"
                    y="145"
                    textAnchor="middle"
                    className="text-lg font-medium"
                    fill="#1e40af"
                  >
                    Component
                  </text>

                  <rect
                    x="550"
                    y="80"
                    width="200"
                    height="120"
                    rx="12"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="#e7f8f0"
                  />
                  <text
                    x="650"
                    y="145"
                    textAnchor="middle"
                    className="text-lg font-medium"
                    fill="#047857"
                  >
                    Database
                  </text>

                  <rect
                    x="300"
                    y="250"
                    width="200"
                    height="120"
                    rx="12"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    fill="#fff3d9"
                  />
                  <text
                    x="400"
                    y="315"
                    textAnchor="middle"
                    className="text-lg font-medium"
                    fill="#b45309"
                  >
                    API
                  </text>

                  <path
                    d="M 250 140 L 300 140"
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <path
                    d="M 500 140 L 550 140"
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <path
                    d="M 150 200 L 350 250"
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <path
                    d="M 650 200 L 450 250"
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />

                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
                    </marker>
                  </defs>
                </svg>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>Rectangle</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Ellipse</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-8 h-0.5 bg-gray-500" />
                    <span>Arrow</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-amber-500 rounded" />
                    <span>API</span>
                  </span>
                </div>
                <span className="inline-flex items-center space-x-2 text-gray-500">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Live collaboration enabled</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(showCreateModal || showJoinModal) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border border-gray-200">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {showCreateModal ? "Create a room" : "Join a room"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter a room slug (e.g., <code className="bg-gray-100 px-1 rounded">team-board</code>)
            </p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="room-slug"
              value={showCreateModal ? createSlug : joinSlug}
              onChange={(e) =>
                showCreateModal ? setCreateSlug(e.target.value) : setJoinSlug(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  showCreateModal ? handleCreate() : handleJoin();
                }
              }}
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreate : handleJoin}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : showCreateModal ? "Create" : "Join"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}
    </section>
  );
}
