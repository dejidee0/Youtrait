"use client";

import { useEffect, useState } from 'react';
import AnimatedBubble from './animated-bubble';

export default function BubbleBackground({ density = 20, colors = [] }) {
  const [bubbles, setBubbles] = useState([]);
  
  const defaultColors = [
    'rgba(139, 92, 246, 0.2)', // Purple
    'rgba(168, 85, 247, 0.2)', // Violet
    'rgba(147, 51, 234, 0.2)', // Purple-600
    'rgba(126, 34, 206, 0.2)', // Purple-700
    'rgba(99, 102, 241, 0.2)', // Indigo
  ];
  
  const bubbleColors = colors.length > 0 ? colors : defaultColors;
  
  useEffect(() => {
    const newBubbles = Array.from({ length: density }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 20,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
    setBubbles(newBubbles);
  }, [density]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <AnimatedBubble
          key={bubble.id}
          size={bubble.size}
          color={bubble.color}
          duration={bubble.duration}
          delay={bubble.delay}
        />
      ))}
    </div>
  );
}