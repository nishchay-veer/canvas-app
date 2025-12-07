import {
  MousePointer2,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Eraser,
  Hand,
} from "lucide-react";
import { Tool } from "./types";

export const TOOLS: {
  id: Tool;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  shortcut: string;
}[] = [
  { id: "hand", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "O" },
  { id: "diamond", icon: Diamond, label: "Diamond", shortcut: "D" },
  { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L" },
  { id: "pencil", icon: Pencil, label: "Pencil", shortcut: "P" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
];

export const STROKE_COLORS = [
  "#1e1e1e",
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
  "#9c36b5",
];

export const FILL_COLORS = [
  "transparent",
  "#ffc9c9",
  "#b2f2bb",
  "#a5d8ff",
  "#ffec99",
  "#eebefa",
];

export const STROKE_WIDTHS = [1, 2, 4];

export const DEFAULT_STROKE_COLOR = "#1e1e1e";
export const DEFAULT_FILL_COLOR = "transparent";
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_TOOL: Tool = "rectangle";

export const GRID_SIZE = 20;
export const MIN_SHAPE_SIZE = 5;
export const MIN_SCALE = 0.2;
export const MAX_SCALE = 5;
export const ZOOM_FACTOR = 1.2;
