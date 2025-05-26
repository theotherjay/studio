export interface Vector2D {
  x: number;
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface GameObject {
  id: string;
  position: Vector2D;
  size: Size2D;
}

export interface Player extends GameObject {}

export interface Tree extends GameObject {}

export type KeysPressed = Record<string, boolean>;
