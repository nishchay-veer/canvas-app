import { Shape, Point } from "../types";
import { GRID_SIZE } from "../constants";

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  pan: Point
) => {
  ctx.save();
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;

  const gridSize = GRID_SIZE * scale;
  const offsetX = pan.x % gridSize;
  const offsetY = pan.y % gridSize;

  for (let x = offsetX; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = offsetY; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
};

export const drawHandDrawnRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const offset = 2;
  ctx.beginPath();
  ctx.moveTo(x + Math.random() * offset, y + Math.random() * offset);
  ctx.lineTo(x + width + Math.random() * offset, y + Math.random() * offset);
  ctx.lineTo(
    x + width + Math.random() * offset,
    y + height + Math.random() * offset
  );
  ctx.lineTo(x + Math.random() * offset, y + height + Math.random() * offset);
  ctx.closePath();
};

export const drawHandDrawnEllipse = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number
) => {
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
  ctx.closePath();
};

export const drawHandDrawnDiamond = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  ctx.beginPath();
  ctx.moveTo(cx, y);
  ctx.lineTo(x + width, cy);
  ctx.lineTo(cx, y + height);
  ctx.lineTo(x, cy);
  ctx.closePath();
};

export const drawHandDrawnLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

export const drawHandDrawnArrow = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const headLength = 15;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Arrow head
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};

export const drawPencilPath = (
  ctx: CanvasRenderingContext2D,
  points: Point[]
) => {
  if (points.length === 0) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) => {
  ctx.font = "20px Virgil, Segoe UI Emoji, sans-serif";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y + 20);
};

export const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  ctx.save();
  ctx.strokeStyle = shape.strokeColor;
  ctx.fillStyle = shape.fillColor;
  ctx.lineWidth = shape.strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([]);

  switch (shape.type) {
    case "rectangle":
      drawHandDrawnRect(ctx, shape.x, shape.y, shape.width, shape.height);
      if (shape.fillColor !== "transparent") {
        ctx.fill();
      }
      ctx.stroke();
      break;

    case "ellipse":
      drawHandDrawnEllipse(
        ctx,
        shape.x + shape.width / 2,
        shape.y + shape.height / 2,
        Math.abs(shape.width) / 2,
        Math.abs(shape.height) / 2
      );
      if (shape.fillColor !== "transparent") {
        ctx.fill();
      }
      ctx.stroke();
      break;

    case "diamond":
      drawHandDrawnDiamond(ctx, shape.x, shape.y, shape.width, shape.height);
      if (shape.fillColor !== "transparent") {
        ctx.fill();
      }
      ctx.stroke();
      break;

    case "line":
      drawHandDrawnLine(
        ctx,
        shape.x,
        shape.y,
        shape.x + shape.width,
        shape.y + shape.height
      );
      break;

    case "arrow":
      drawHandDrawnArrow(
        ctx,
        shape.x,
        shape.y,
        shape.x + shape.width,
        shape.y + shape.height
      );
      break;

    case "pencil":
      if (shape.points && shape.points.length > 0) {
        drawPencilPath(ctx, shape.points);
      }
      break;

    case "text":
      drawText(ctx, shape.text || "", shape.x, shape.y, shape.strokeColor);
      break;
  }

  ctx.restore();
};
