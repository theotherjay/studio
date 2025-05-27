"use client";

import type { Player, Tree, Vector2D, Size2D, KeysPressed, GameObject } from '@/lib/types';
import { TreePine } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  INITIAL_VIEWPORT_WIDTH,
  INITIAL_VIEWPORT_HEIGHT,
  PLAYER_SIZE_FACTOR,
  PLAYER_SPEED,
  WORLD_SCALE_FACTOR,
  NUMBER_OF_TREES,
  TREE_BASE_WIDTH,
  TREE_BASE_HEIGHT,
  TREE_SIZE_VARIATION,
  PARALLAX_BACKGROUND_SCALE,
  PARALLAX_SPEED_FACTOR,
} from '@/lib/constants';

const GameCanvas: React.FC = () => {
  const [viewportSize, setViewportSize] = useState<Size2D>({ width: INITIAL_VIEWPORT_WIDTH, height: INITIAL_VIEWPORT_HEIGHT });
  const [worldSize, setWorldSize] = useState<Size2D>({ width: 0, height: 0 });
  const [player, setPlayer] = useState<Player | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  const [cameraPosition, setCameraPosition] = useState<Vector2D>({ x: 0, y: 0 });
  
  const lastTimeRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const checkCollision = useCallback((rect1: GameObject, rect2: GameObject): boolean => {
    // Add a small buffer to collision to make it feel less sticky
    const buffer = 2;
    return (
      rect1.position.x < rect2.position.x + rect2.size.width - buffer &&
      rect1.position.x + rect1.size.width > rect2.position.x + buffer &&
      rect1.position.y < rect2.position.y + rect2.size.height - buffer &&
      rect1.position.y + rect1.size.height > rect2.position.y + buffer
    );
  }, []);

  // Initialize game
  useEffect(() => {
    // For simplicity, using fixed viewport size. Could be made responsive.
    const currentViewportSize = { width: INITIAL_VIEWPORT_WIDTH, height: INITIAL_VIEWPORT_HEIGHT };
    setViewportSize(currentViewportSize);

    const currentWorldSize = {
      width: currentViewportSize.width * WORLD_SCALE_FACTOR,
      height: currentViewportSize.height * WORLD_SCALE_FACTOR,
    };
    setWorldSize(currentWorldSize);

    const playerSize = {
      width: currentViewportSize.width / PLAYER_SIZE_FACTOR,
      height: currentViewportSize.height / PLAYER_SIZE_FACTOR,
    };

    const initialPlayer: Player = {
      id: 'player',
      position: {
        x: currentWorldSize.width / 2 - playerSize.width / 2,
        y: currentWorldSize.height / 2 - playerSize.height / 2,
      },
      size: playerSize,
    };
    setPlayer(initialPlayer);

    const generatedTrees: Tree[] = [];
    for (let i = 0; i < NUMBER_OF_TREES; i++) {
      const treeSizeVariationFactor = 1 + (Math.random() - 0.5) * 2 * TREE_SIZE_VARIATION;
      const treeSize = {
        width: TREE_BASE_WIDTH * treeSizeVariationFactor,
        height: TREE_BASE_HEIGHT * treeSizeVariationFactor,
      };
      
      let pos: Vector2D;
      let newTree: Tree;
      let collisionWithOtherTreeOrPlayer;

      do {
        collisionWithOtherTreeOrPlayer = false;
        pos = {
          x: Math.random() * (currentWorldSize.width - treeSize.width),
          y: Math.random() * (currentWorldSize.height - treeSize.height),
        };
        newTree = { id: `tree-${i}`, position: pos, size: treeSize };

        // Check collision with player start
        if (checkCollision(newTree, initialPlayer)) {
          collisionWithOtherTreeOrPlayer = true;
          continue;
        }
        // Check collision with already generated trees
        for (const existingTree of generatedTrees) {
          if (checkCollision(newTree, existingTree)) {
            collisionWithOtherTreeOrPlayer = true;
            break;
          }
        }
      } while (collisionWithOtherTreeOrPlayer);
      
      generatedTrees.push(newTree);
    }
    setTrees(generatedTrees);
  }, [checkCollision]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [event.key.toLowerCase()]: true }));
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [event.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop for movement and camera
  useEffect(() => {
    const gameLoop = (time: number) => {
      if (!player) return;

      const deltaTime = (time - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = time;

      let moveX = 0;
      let moveY = 0;

      if (keysPressed['w'] || keysPressed['arrowup']) moveY -= PLAYER_SPEED * deltaTime;
      if (keysPressed['s'] || keysPressed['arrowdown']) moveY += PLAYER_SPEED * deltaTime;
      if (keysPressed['a'] || keysPressed['arrowleft']) moveX -= PLAYER_SPEED * deltaTime;
      if (keysPressed['d'] || keysPressed['arrowright']) moveX += PLAYER_SPEED * deltaTime;

      if (moveX === 0 && moveY === 0) {
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const newPlayerPosition = { ...player.position };

    // Try moving X
      const tempPlayerX: Player = { ...player, position: { x: player.position.x + moveX, y: player.position.y } };
      
    let canMoveX = true;
      if (tempPlayerX.position.x >= 0 && tempPlayerX.position.x + tempPlayerX.size.width <= worldSize.width) {
      for (const tree of trees) {
        if (checkCollision(tempPlayerX, tree)) {
          canMoveX = false;
          break;
        }
      }
      } else {
        canMoveX = false;
    }
    if (canMoveX) {
        newPlayerPosition.x += moveX;
    }

    // Try moving Y
      const tempPlayerY: Player = { ...player, position: { x: newPlayerPosition.x, y: player.position.y + moveY } }; // Use potentially updated X for Y check
    let canMoveY = true;
      if (tempPlayerY.position.y >= 0 && tempPlayerY.position.y + tempPlayerY.size.height <= worldSize.height) {
      for (const tree of trees) {
        if (checkCollision(tempPlayerY, tree)) {
          canMoveY = false;
          break;
        }
      }
      } else {
        canMoveY = false;
    }
    if (canMoveY) {
        newPlayerPosition.y += moveY;
    }
      
      setPlayer((p) => p ? { ...p, position: newPlayerPosition } : null);

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    const requestRef = useRef<number>();
    lastTimeRef.current = performance.now(); // Initialize lastTime
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [keysPressed, player, trees, worldSize, checkCollision]);

  // Update camera position
  useEffect(() => {
    if (!player) return;

    const camX = player.position.x + player.size.width / 2 - viewportSize.width / 2;
    const camY = player.position.y + player.size.height / 2 - viewportSize.height / 2;

    setCameraPosition({
      x: Math.max(0, Math.min(camX, worldSize.width - viewportSize.width)),
      y: Math.max(0, Math.min(camY, worldSize.height - viewportSize.height)),
    });
  }, [player, viewportSize, worldSize]);


  if (!player) {
    return <div style={{ width: viewportSize.width, height: viewportSize.height }} className="border-2 border-primary rounded-lg shadow-lg flex items-center justify-center">Loading Game...</div>;
  }
  
  const parallaxBgSize = {
    width: worldSize.width * PARALLAX_BACKGROUND_SCALE,
    height: worldSize.height * PARALLAX_BACKGROUND_SCALE,
  };

  return (
    <div
      ref={gameAreaRef}
      style={{
        width: viewportSize.width,
        height: viewportSize.height,
      }}
      className="overflow-hidden relative border-4 border-primary rounded-xl shadow-2xl bg-background focus:outline-none"
      tabIndex={0} // Make it focusable for keyboard events, though global listeners are used
    >
      {/* Parallax Background Layer */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: parallaxBgSize.width,
          height: parallaxBgSize.height,
          backgroundImage: `url(https://placehold.co/${Math.round(parallaxBgSize.width)}x${Math.round(parallaxBgSize.height)}/286B2B/F5F5DC.png?text=)`, // Darker green, beige text (transparent effectively)
          backgroundRepeat: 'repeat', // If the placeholder is small, repeat it
          transform: `translate(-${cameraPosition.x * PARALLAX_SPEED_FACTOR}px, -${cameraPosition.y * PARALLAX_SPEED_FACTOR}px)`,
          zIndex: 0,
        }}
        data-ai-hint="forest pattern"
      />

      {/* Game World Layer (Ground) */}
      <div
        style={{
          width: worldSize.width,
          height: worldSize.height,
          backgroundColor: 'hsl(var(--background))', // Soft Beige ground
          transform: `translate(-${cameraPosition.x}px, -${cameraPosition.y}px)`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Player */}
        <div
          style={{
            position: 'absolute',
            left: player.position.x,
            top: player.position.y,
            width: player.size.width,
            height: player.size.height,
            backgroundColor: 'hsl(var(--primary))', // Forest Green
            borderRadius: '25%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
          aria-label="Player"
        />

        {/* Trees */}
        {trees.map((tree) => (
          <div
            key={tree.id}
            style={{
              position: 'absolute',
              left: tree.position.x,
              top: tree.position.y,
              width: tree.size.width,
              height: tree.size.height,
              zIndex: 5 + Math.round(tree.position.y /100), // simple depth effect
            }}
            aria-label="Tree obstacle"
          >
            <TreePine
              color="hsl(var(--accent))" // Warm Earthy Brown
              absoluteStrokeWidth
              strokeWidth={1.5}
              width="100%"
              height="100%"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCanvas;
