"use client";
import { Undo2, Redo2, Trash2, Download } from "lucide-react";

type ActionBarProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
};

export default function ActionBar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onExport,
}: ActionBarProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700 disabled:opacity-40"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700 disabled:opacity-40"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={18} />
        </button>
      </div>
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={onClear}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Clear canvas"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onExport}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
          title="Export as PNG"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
