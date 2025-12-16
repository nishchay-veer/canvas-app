"use client";

import { PlusCircle, LogIn, ArrowRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Modal, Input, Button, Toast } from "@repo/ui";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleCreate = useCallback(async () => {
    const slug = createSlug.trim();
    if (!slug) {
      setError("Room slug is required");
      return;
    }

    const token = localStorage.getItem("token");
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
    } catch {
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
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to join a room");
      router.push("/signin");
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
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
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main content */}
        <div className="text-center animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Open source & free forever</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Where ideas take
            <span className="relative mx-3">
              <span className="relative z-10">shape</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-blue-500/30"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q25 0, 50 8 T100 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
            A minimal, collaborative whiteboard for sketching diagrams that feel
            hand-drawn. Real-time sync, infinite canvas, zero friction.
          </p>

          {/* CTA Buttons */}
          {!mounted ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="h-12 w-40 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-12 w-36 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowJoinModal(false);
                    setError(null);
                  }}
                  variant="primary"
                  size="lg"
                  className="shadow-sm hover:shadow-md"
                  rightIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Create room
                </Button>
                <Button
                  onClick={() => {
                    setShowJoinModal(true);
                    setShowCreateModal(false);
                    setError(null);
                  }}
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Join room
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                Privacy-first • Works in your browser • Live collaboration
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => router.push("/signin")}
                  variant="primary"
                  size="lg"
                  className="shadow-sm hover:shadow-md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign in to start
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                Sign in to create or join rooms and start collaborating.
              </p>
            </>
          )}

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              No account needed
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Works offline
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              End-to-end encrypted
            </span>
          </div>
        </div>

        {/* Canvas Preview */}
        <div
          className="mt-20 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Mock toolbar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
              </div>
              <div className="flex-1 flex justify-center gap-2">
                {["▢", "○", "△", "—", "✎"].map((icon, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                      i === 0
                        ? "bg-gray-900 text-white"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400">2 collaborators</div>
            </div>

            {/* Canvas area with hand-drawn shapes */}
            <div
              className="aspect-video relative bg-[#fafafa]"
              style={{
                backgroundImage: `
                linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
              `,
                backgroundSize: "24px 24px",
              }}
            >
              <svg
                viewBox="0 0 800 450"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Hand-drawn style rectangle */}
                <path
                  d="M100 100 Q102 98, 250 100 Q253 102, 250 180 Q248 183, 100 180 Q97 178, 100 100"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="#f3f4f6"
                  strokeLinecap="round"
                />
                <text
                  x="175"
                  y="145"
                  textAnchor="middle"
                  className="text-sm"
                  fill="#374151"
                  fontFamily="var(--font-body)"
                >
                  User Flow
                </text>

                {/* Hand-drawn ellipse */}
                <ellipse
                  cx="500"
                  cy="140"
                  rx="80"
                  ry="50"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="#fef3c7"
                  strokeDasharray="4 2"
                />
                <text
                  x="500"
                  y="145"
                  textAnchor="middle"
                  className="text-sm"
                  fill="#374151"
                  fontFamily="var(--font-body)"
                >
                  Decision
                </text>

                {/* Connector arrow */}
                <path
                  d="M250 140 Q350 130, 420 140"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />

                {/* Another rectangle below */}
                <path
                  d="M150 280 Q153 277, 320 280 Q323 283, 320 360 Q317 363, 150 360 Q147 357, 150 280"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="#dbeafe"
                  strokeLinecap="round"
                />
                <text
                  x="235"
                  y="325"
                  textAnchor="middle"
                  className="text-sm"
                  fill="#374151"
                  fontFamily="var(--font-body)"
                >
                  Process
                </text>

                {/* Connector from decision to process */}
                <path
                  d="M500 190 Q500 250, 320 300"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  markerEnd="url(#arrow)"
                />

                {/* Small floating elements for visual interest */}
                <circle
                  cx="650"
                  cy="320"
                  r="30"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="#fce7f3"
                />
                <text
                  x="650"
                  y="325"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#374151"
                >
                  End
                </text>

                {/* Cursor indicator */}
                <g transform="translate(580, 120)">
                  <path
                    d="M0 0 L0 16 L4 12 L8 20 L10 19 L6 11 L12 11 Z"
                    fill="#3b82f6"
                  />
                  <circle cx="16" cy="24" r="8" fill="#3b82f6" opacity="0.2" />
                </g>

                <defs>
                  <marker
                    id="arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0 0 L10 3 L0 6 Z" fill="#374151" />
                  </marker>
                </defs>
              </svg>

              {/* Floating user avatars */}
              <div className="absolute bottom-4 right-4 flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                  A
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                  B
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Join Modal */}
      <Modal
        isOpen={showCreateModal || showJoinModal}
        onClose={closeModals}
        title={showCreateModal ? "Create a room" : "Join a room"}
        className="bg-white"
      >
        <p className="text-sm text-gray-500 mb-4">
          Enter a room slug (e.g.,{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
            team-board
          </code>
          )
        </p>
        <Input
          type="text"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          placeholder="room-slug"
          value={showCreateModal ? createSlug : joinSlug}
          onChange={(e) =>
            showCreateModal
              ? setCreateSlug(e.target.value)
              : setJoinSlug(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (showCreateModal) {
                handleCreate();
              } else {
                handleJoin();
              }
            }
          }}
          error={error || undefined}
        />
        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={closeModals}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={showCreateModal ? handleCreate : handleJoin}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="primary"
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            {showCreateModal ? "Create" : "Join"}
          </Button>
        </div>
      </Modal>

      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}
    </section>
  );
}
