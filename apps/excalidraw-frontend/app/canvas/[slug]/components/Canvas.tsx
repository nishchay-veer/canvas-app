"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Tool, Shape, Point } from "../types";
import {
  DEFAULT_STROKE_COLOR,
  DEFAULT_FILL_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_TOOL,
  MIN_SHAPE_SIZE,
  MIN_SCALE,
  MAX_SCALE,
  ZOOM_FACTOR,
} from "../constants";
import { drawGrid, drawShape } from "../utils/drawing";
import { useCanvasSize } from "../hooks/useCanvasSize";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useHistory } from "../hooks/useHistory";
import Toolbar from "./Toolbar";
import ColorPicker from "./ColorPicker";
import ZoomControls from "./ZoomControls";
import ActionBar from "./ActionBar";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>(DEFAULT_TOOL);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [startPos, setStartPos] = useState<Point>({ x: 0, y: 0 });
  const [strokeColor, setStrokeColor] = useState(DEFAULT_STROKE_COLOR);
  const [fillColor, setFillColor] = useState(DEFAULT_FILL_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState<Point>({ x: 0, y: 0 });

  const { saveToHistory, undo, redo, canUndo, canRedo } = useHistory();

  useCanvasSize(canvasRef);

  // Simple undo/redo for local session (collaborative undo is complex)
  const handleUndo = useCallback(() => {
    const prevShapes = undo();
    if (prevShapes) {
      setShapes(prevShapes);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextShapes = redo();
    if (nextShapes) {
      setShapes(nextShapes);
    }
  }, [redo]);

  useKeyboardShortcuts({
    setTool,
    undo: handleUndo,
    redo: handleRedo,
  });

  // Draw all shapes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height, scale, pan);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw all shapes
    shapes.forEach((shape) => drawShape(ctx, shape));

    // Draw current shape being created
    if (currentShape) {
      drawShape(ctx, currentShape);
    }

    ctx.restore();
  }, [shapes, currentShape, scale, pan]);

  const getMousePos = useCallback(
    (e: React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - pan.x) / scale,
        y: (e.clientY - rect.top - pan.y) / scale,
      };
    },
    [pan, scale]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = getMousePos(e);

      if (tool === "hand") {
        setIsPanning(true);
        setLastPanPos({ x: e.clientX, y: e.clientY });
        return;
      }

      setIsDrawing(true);
      setStartPos(pos);

      const newShape: Shape = {
        id: Date.now().toString(),
        type: tool,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        points: tool === "pencil" ? [{ x: pos.x, y: pos.y }] : undefined,
        strokeColor,
        fillColor,
        strokeWidth,
      };

      if (tool === "text") {
        const text = prompt("Enter text:");
        if (text) {
          newShape.text = text;
          newShape.width = text.length * 12;
          newShape.height = 24;
          // Send to server
          saveToHistory([...shapes, newShape]);
          setShapes((prev) => [...prev, newShape]);
        }
        setIsDrawing(false);
        return;
      }

      setCurrentShape(newShape);
    },
    [
      tool,
      getMousePos,
      strokeColor,
      fillColor,
      strokeWidth,
      shapes,
      saveToHistory,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastPanPos.x;
        const dy = e.clientY - lastPanPos.y;
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPanPos({ x: e.clientX, y: e.clientY });
        return;
      }

      if (!isDrawing || !currentShape) return;

      const pos = getMousePos(e);

      if (tool === "pencil") {
        setCurrentShape((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            points: [...(prev.points || []), { x: pos.x, y: pos.y }],
          };
        });
      } else {
        setCurrentShape((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            width: pos.x - startPos.x,
            height: pos.y - startPos.y,
          };
        });
      }
    },
    [
      isPanning,
      lastPanPos,
      isDrawing,
      currentShape,
      tool,
      getMousePos,
      startPos,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (currentShape && isDrawing) {
      const isTooSmall =
        tool !== "pencil" &&
        Math.abs(currentShape.width) < MIN_SHAPE_SIZE &&
        Math.abs(currentShape.height) < MIN_SHAPE_SIZE;

      const hasTooFewPoints =
        tool === "pencil" &&
        (!currentShape.points || currentShape.points.length < 2);

      if (!isTooSmall && !hasTooFewPoints) {
        saveToHistory([...shapes, currentShape]);
        setShapes((prev) => [...prev, currentShape]);
      }
    }

    setIsDrawing(false);
    setCurrentShape(null);
  }, [isPanning, currentShape, isDrawing, tool, shapes, saveToHistory]);

  const handleClear = useCallback(() => {
    saveToHistory([]);
    setShapes([]);
  }, [saveToHistory]);

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "excalidraw-export.png";
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s * ZOOM_FACTOR, MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(s / ZOOM_FACTOR, MIN_SCALE));
  }, []);

  return (
    <div className="h-screen w-screen bg-[#f8f9fa] overflow-hidden relative">
      <Toolbar currentTool={tool} onToolChange={setTool} />

      <ColorPicker
        strokeColor={strokeColor}
        fillColor={fillColor}
        strokeWidth={strokeWidth}
        onStrokeColorChange={setStrokeColor}
        onFillColorChange={setFillColor}
        onStrokeWidthChange={setStrokeWidth}
      />

      <ZoomControls scale={scale} onZoomIn={zoomIn} onZoomOut={zoomOut} />

      <ActionBar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onExport={handleExport}
      />

      <canvas
        ref={canvasRef}
        className={`w-full h-full ${
          tool === "hand" ? "cursor-grab" : "cursor-crosshair"
        } ${isPanning ? "cursor-grabbing" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
