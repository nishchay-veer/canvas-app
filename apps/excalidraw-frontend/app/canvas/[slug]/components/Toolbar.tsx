"use client";
import { Tool } from "../types";
import { TOOLS } from "../constants";

type ToolbarProps = {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
};

export default function Toolbar({ currentTool, onToolChange }: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
            className={`p-2 rounded-md transition-colors ${
              currentTool === tool.id
                ? "bg-[#e8e8fe] text-[#6965DB]"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
