import { useEffect } from "react";
import { Tool } from "../types";

type KeyboardShortcutsProps = {
  setTool: (tool: Tool) => void;
  undo: () => void;
  redo: () => void;
};

export const useKeyboardShortcuts = ({
  setTool,
  undo,
  redo,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case "h":
          setTool("hand");
          break;
        case "v":
          setTool("select");
          break;
        case "r":
          setTool("rectangle");
          break;
        case "o":
          setTool("ellipse");
          break;
        case "d":
          setTool("diamond");
          break;
        case "a":
          setTool("arrow");
          break;
        case "l":
          setTool("line");
          break;
        case "p":
          setTool("pencil");
          break;
        case "t":
          setTool("text");
          break;
        case "e":
          setTool("eraser");
          break;
        case "z":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.shiftKey ? redo() : undo();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTool, undo, redo]);
};
