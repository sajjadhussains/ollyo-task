import { useState } from "react";
import type { MenuItem } from "../types/device.types";

export const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const [droppedItem, setDroppedItem] = useState<MenuItem | null>(null);

  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    setDroppedItem(draggedItem);
    setDraggedItem(null);
  };

  const removeDevice = () => {
    setDroppedItem(null);
  };

  return {
    draggedItem,
    droppedItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    removeDevice,
  };
};
