"use client";

import { motion } from 'framer-motion';

export default function AnimatedBubble({ 
  size = 60, 
  color = 'rgba(139, 92, 246, 0.3)', 
  duration = 20,
  delay = 0,
  className = ""
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${Math.random() * 100}%`,
        top: '100%',
      }}
      animate={{
        y: [-100, -window?.innerHeight || -800],
        x: [0, Math.random() * 100 - 50],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.7, 0.3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}