export type Tool =
  | "select"
  | "hand"
  | "rectangle"
  | "ellipse"
  | "diamond"
  | "arrow"
  | "line"
  | "pencil"
  | "text"
  | "eraser";

export type Point = {
  x: number;
  y: number;
};

export type Shape = {
  id: string;
  type: Tool;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: Point[];
  text?: string;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
};

export type CanvasState = {
  shapes: Shape[];
  currentShape: Shape | null;
  history: Shape[][];
  historyIndex: number;
};
