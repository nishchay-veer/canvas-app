import { useState, useCallback } from "react";
import { Shape } from "../types";

// Track user's own actions for undo/redo
interface UserAction {
  type: "add" | "remove";
  shapeId: string;
  shape?: Shape; // For undo of remove (redo of add)
}

export const useHistory = (currentUserId: string | null) => {
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  // Track user's own actions separately
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [userActionIndex, setUserActionIndex] = useState(-1);

  const saveToHistory = useCallback(
    (newShapes: Shape[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newShapes);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const addUserAction = useCallback(
    (action: UserAction) => {
      if (!currentUserId) return;
      
      setUserActions((prev) => {
        // Remove any actions after current index (when undoing then doing new action)
        const newActions = prev.slice(0, userActionIndex + 1);
        newActions.push(action);
        return newActions;
      });
      setUserActionIndex((prev) => prev + 1);
    },
    [currentUserId, userActionIndex]
  );

  const undo = useCallback(
    (currentShapes: Shape[]) => {
      if (!currentUserId || userActionIndex < 0) {
        return null;
      }

      // Find the most recent action by current user
      const lastAction = userActions[userActionIndex];
      if (!lastAction) return null;

      // Remove the shape that was added by the user
      // Double-check that the shape belongs to the current user
      const updatedShapes = currentShapes.filter((shape) => {
        // Only remove if it matches the shapeId AND belongs to current user
        if (shape.id === lastAction.shapeId && shape.user_id === currentUserId) {
          return false; // Remove this shape
        }
        return true; // Keep all other shapes
      });

      // Move action index back
      setUserActionIndex((prev) => prev - 1);

      // Save to history (but don't broadcast - this is local only)
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(updatedShapes);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);

      return updatedShapes;
    },
    [currentUserId, userActionIndex, userActions, historyIndex]
  );

  const redo = useCallback(
    (currentShapes: Shape[]) => {
      if (!currentUserId || userActionIndex >= userActions.length - 1) {
        return null;
      }

      // Get the next action
      const nextActionIndex = userActionIndex + 1;
      const nextAction = userActions[nextActionIndex];
      if (!nextAction || nextAction.type !== "add" || !nextAction.shape) {
        return null;
      }

      // Re-add the shape
      const updatedShapes = [...currentShapes, nextAction.shape];

      // Move action index forward
      setUserActionIndex((prev) => prev + 1);

      // Save to history
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(updatedShapes);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);

      return updatedShapes;
    },
    [currentUserId, userActionIndex, userActions, historyIndex]
  );

  const canUndo = currentUserId ? userActionIndex >= 0 : false;
  const canRedo = currentUserId
    ? userActionIndex < userActions.length - 1
    : false;

  return {
    saveToHistory,
    addUserAction,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
