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
import { useSocket } from "../hooks/useSocket";
import Toolbar from "./Toolbar";
import ColorPicker from "./ColorPicker";
import ZoomControls from "./ZoomControls";
import ActionBar from "./ActionBar";

export default function Canvas({ roomId }: { roomId: number | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
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
  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [textInputPos, setTextInputPos] = useState<Point | null>(null);
  const [textInputValue, setTextInputValue] = useState("");

  // Get current user ID from localStorage
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id || null);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  const { saveToHistory, addUserAction, undo, redo, canUndo, canRedo } = useHistory(currentUserId);
  const { socket, isConnected, sendMessage } = useSocket(roomId);

  useCanvasSize(canvasRef);

  // Undo removes the most recent shape created by current user
  // This should be synchronized across all users' canvases
  const handleUndo = useCallback(() => {
    const updatedShapes = undo(shapes);
    if (updatedShapes) {
      // Find the shape that was removed (the difference between old and new)
      const removedShape = shapes.find(
        (shape) => !updatedShapes.some((s) => s.id === shape.id)
      );

      if (removedShape && roomId && isConnected) {
        // Send delete message to remove shape from all users' canvases
        sendMessage({
          type: "delete_shape",
          room_id: roomId,
          shape_id: removedShape.id,
        });
      }

      setShapes(updatedShapes);
    }
  }, [undo, shapes, roomId, isConnected, sendMessage]);

  // Redo re-adds the most recent shape that was undone
  // This should be synchronized across all users' canvases
  const handleRedo = useCallback(() => {
    const updatedShapes = redo(shapes);
    if (updatedShapes) {
      // Find the shape that was re-added (the difference between old and new)
      const reAddedShape = updatedShapes.find(
        (shape) => !shapes.some((s) => s.id === shape.id)
      );

      if (reAddedShape && roomId && isConnected) {
        // Send shape message to add it back to all users' canvases
        sendMessage({
          type: "shape",
          room_id: roomId,
          shape: reAddedShape,
        });
      }

      setShapes(updatedShapes);
    }
  }, [redo, shapes, roomId, isConnected, sendMessage]);

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
      // Don't handle if clicking on text input
      if ((e.target as HTMLElement).tagName === "INPUT") {
        return;
      }

      const pos = getMousePos(e);

      if (tool === "hand") {
        setIsPanning(true);
        setLastPanPos({ x: e.clientX, y: e.clientY });
        return;
      }

      if (tool === "text") {
        // Store canvas coordinates (will be converted to screen coordinates when rendering)
        setTextInputPos(pos);
        setTextInputValue("");
        setIsTextInputActive(true);
        e.preventDefault();
        e.stopPropagation();
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
        // Add user_id to shape if current user exists
        const shapeWithUserId: Shape = currentUserId
          ? { ...currentShape, user_id: currentUserId }
          : currentShape;

        saveToHistory([...shapes, shapeWithUserId]);
        setShapes((prev) => [...prev, shapeWithUserId]);
        
        // Track user action for undo
        if (currentUserId) {
          addUserAction({
            type: "add",
            shapeId: shapeWithUserId.id,
            shape: shapeWithUserId,
          });
        }
        
        // Send shape to other users via WebSocket
        if (roomId && isConnected) {
          sendMessage({
            type: "shape",
            room_id: roomId,
            shape: shapeWithUserId,
          });
        }
      }
    }

    setIsDrawing(false);
    setCurrentShape(null);
  }, [isPanning, currentShape, isDrawing, tool, shapes, saveToHistory, roomId, isConnected, sendMessage]);

  const handleClear = useCallback(() => {
    saveToHistory([]);
    setShapes([]);
    
    // Notify other users to clear canvas
    if (roomId && isConnected) {
      sendMessage({
        type: "clear_canvas",
        room_id: roomId,
      });
    }
  }, [saveToHistory, roomId, isConnected, sendMessage]);

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

  // Auto-focus text input when it becomes active
  useEffect(() => {
    if (isTextInputActive && textInputRef.current) {
      // Small delay to ensure the input is rendered before focusing
      const timer = setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isTextInputActive]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "initial_shapes" && data.room_id === roomId) {
          // Load initial shapes when joining room
          setShapes(data.shapes);
          saveToHistory(data.shapes);
        } else if (data.type === "shape" && data.room_id === roomId) {
          // Add shape received from another user
          // Don't add to user action history - these are from other users
          setShapes((prev) => {
            // Check if shape already exists (avoid duplicates)
            if (prev.some((s) => s.id === data.shape.id)) {
              return prev;
            }
            // Only add if it's not from current user (to avoid adding our own shapes back)
            if (data.shape.user_id && data.shape.user_id === currentUserId) {
              return prev;
            }
            const newShapes = [...prev, data.shape];
            saveToHistory(newShapes);
            return newShapes;
          });
        } else if (data.type === "delete_shape" && data.room_id === roomId) {
          // Remove shape deleted by another user
          setShapes((prev) => {
            const newShapes = prev.filter((s) => s.id !== data.shape_id);
            saveToHistory(newShapes);
            return newShapes;
          });
        } else if (data.type === "clear_canvas" && data.room_id === roomId) {
          // Clear canvas when another user clears it
          setShapes([]);
          saveToHistory([]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }, [socket, roomId, saveToHistory, currentUserId]);


  // Handle text input submission
  const handleTextSubmit = useCallback(() => {
    // Don't submit if input is empty
    if (!textInputValue.trim() || !textInputPos) {
      setIsTextInputActive(false);
      setTextInputPos(null);
      setTextInputValue("");
      return;
    }

    // textInputPos is already in canvas coordinates
    const newShape: Shape = {
      id: Date.now().toString(),
      type: "text",
      x: textInputPos.x,
      y: textInputPos.y,
      width: textInputValue.length * 12,
      height: 24,
      text: textInputValue,
      strokeColor,
      fillColor,
      strokeWidth,
      ...(currentUserId && { user_id: currentUserId }),
    };

    saveToHistory([...shapes, newShape]);
    setShapes((prev) => [...prev, newShape]);
    
    // Track user action for undo
    if (currentUserId) {
      addUserAction({
        type: "add",
        shapeId: newShape.id,
        shape: newShape,
      });
    }
    
    // Send text shape to other users via WebSocket
    if (roomId && isConnected) {
      sendMessage({
        type: "shape",
        room_id: roomId,
        shape: newShape,
      });
    }
    
    setIsTextInputActive(false);
    setTextInputPos(null);
    setTextInputValue("");
  }, [textInputValue, textInputPos, strokeColor, fillColor, strokeWidth, shapes, saveToHistory, roomId, isConnected, sendMessage]);

  // Handle text input cancellation
  const handleTextCancel = useCallback(() => {
    setIsTextInputActive(false);
    setTextInputPos(null);
    setTextInputValue("");
  }, []);

  // Handle text input key events
  const handleTextInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTextSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleTextCancel();
      }
    },
    [handleTextSubmit, handleTextCancel]
  );

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
      {isTextInputActive && textInputPos && (() => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const screenX = rect.left + pan.x + textInputPos.x * scale;
        const screenY = rect.top + pan.y + textInputPos.y * scale;
        
        return (
          <input
            ref={textInputRef}
            type="text"
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            onKeyDown={handleTextInputKeyDown}
            onBlur={(e) => {
              // Delay blur to allow Enter key to process first
              setTimeout(() => {
                if (document.activeElement !== textInputRef.current) {
                  handleTextSubmit();
                }
              }, 100);
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: `${screenX}px`,
              top: `${screenY}px`,
              font: "20px Virgil, Segoe UI Emoji, sans-serif",
              color: strokeColor,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: 0,
              margin: 0,
              minWidth: "200px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              zIndex: 1000,
            }}
            className="text-input"
          />
        );
      })()}
    </div>
  );
}
