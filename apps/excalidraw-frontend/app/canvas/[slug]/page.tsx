"use client";
import Canvas from "./components/Canvas";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { LoadingScreen, EmptyState, EmptyStateIcons, Button } from "@repo/ui";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001";

type PageState =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "not-found"
  | "error";

export default function CanvasPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [roomId, setRoomId] = useState<number | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");

  useEffect(() => {
    async function fetchRoomId() {
      if (!slug) return;

      const token = localStorage.getItem("token");

      if (!token) {
        setPageState("unauthenticated");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/rooms/${slug}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setRoomId(response.data.room.id);
        setPageState("authenticated");
      } catch (error) {
        console.error("Error fetching room:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setPageState("unauthenticated");
          } else if (error.response?.status === 404) {
            setPageState("not-found");
          } else {
            setPageState("error");
          }
        } else {
          setPageState("error");
        }
      }
    }

    fetchRoomId();
  }, [slug]);

  if (pageState === "loading") {
    return <LoadingScreen message="Loading canvas..." />;
  }

  if (pageState === "unauthenticated") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <EmptyState
          icon={EmptyStateIcons.lock}
          title="Sign in required"
          description="Please sign in to access this canvas."
          action={
            <Link href="/signin">
              <Button variant="primary">Sign In</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <EmptyState
          icon={EmptyStateIcons.notFound}
          title="Room not found"
          description={
            <>
              The room{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                {slug}
              </code>{" "}
              doesn&apos;t exist or has been deleted.
            </>
          }
          action={
            <Link href="/">
              <Button variant="primary">Go Home</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <EmptyState
          icon={EmptyStateIcons.error}
          title="Something went wrong"
          description="We couldn't load this canvas. Please try again."
          action={
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return <Canvas roomId={roomId!} />;
}
