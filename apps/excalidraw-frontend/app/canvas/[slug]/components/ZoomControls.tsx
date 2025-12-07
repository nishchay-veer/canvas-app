"use client";
import { ZoomIn, ZoomOut } from "lucide-react";

type ZoomControlsProps = {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
}: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Zoom out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="px-2 text-sm text-gray-600 min-w-[50px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
}
