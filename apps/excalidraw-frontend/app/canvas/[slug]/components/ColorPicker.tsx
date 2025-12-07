"use client";
import { STROKE_COLORS, FILL_COLORS, STROKE_WIDTHS } from "../constants";

type ColorPickerProps = {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  onStrokeColorChange: (color: string) => void;
  onFillColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
};

export default function ColorPicker({
  strokeColor,
  fillColor,
  strokeWidth,
  onStrokeColorChange,
  onFillColorChange,
  onStrokeWidthChange,
}: ColorPickerProps) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 flex flex-col gap-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      {/* Stroke Color */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Stroke</p>
        <div className="grid grid-cols-3 gap-1">
          {STROKE_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onStrokeColorChange(color)}
              className={`w-6 h-6 rounded border-2 ${
                strokeColor === color ? "border-[#6965DB]" : "border-gray-200"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Fill Color */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Background</p>
        <div className="grid grid-cols-3 gap-1">
          {FILL_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onFillColorChange(color)}
              className={`w-6 h-6 rounded border-2 ${
                fillColor === color ? "border-[#6965DB]" : "border-gray-200"
              } ${color === "transparent" ? "bg-white" : ""}`}
              style={{
                backgroundColor: color === "transparent" ? undefined : color,
                backgroundImage:
                  color === "transparent"
                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                    : undefined,
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Stroke width</p>
        <div className="flex gap-1">
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width}
              onClick={() => onStrokeWidthChange(width)}
              className={`flex-1 py-1 rounded text-xs ${
                strokeWidth === width
                  ? "bg-[#e8e8fe] text-[#6965DB]"
                  : "hover:bg-gray-100"
              }`}
            >
              {width}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
