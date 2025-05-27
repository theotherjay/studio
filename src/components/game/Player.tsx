import React from 'react';
import type { Player } from '@/lib/types';

interface PlayerProps {
  player: Player;
}

const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: player.position.x,
        top: player.position.y,
        width: player.size.width,
        height: player.size.height,
        backgroundColor: 'hsl(var(--primary))',
        borderRadius: '25%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10,
      }}
      aria-label="Player"
    />
  );
};

export default Player;