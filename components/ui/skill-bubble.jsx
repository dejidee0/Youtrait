"use client";

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, Zap, Crown } from 'lucide-react';

const skillLevels = {
  beginner: {
    color: 'from-gray-400 to-gray-600',
    icon: null,
    size: 'w-16 h-16',
    textSize: 'text-xs',
  },
  intermediate: {
    color: 'from-blue-400 to-blue-600',
    icon: Heart,
    size: 'w-20 h-20',
    textSize: 'text-sm',
  },
  expert: {
    color: 'from-purple-400 to-purple-600',
    icon: Award,
    size: 'w-24 h-24',
    textSize: 'text-sm',
  },
  godmode: {
    color: 'from-yellow-400 to-orange-500',
    icon: Crown,
    size: 'w-28 h-28',
    textSize: 'text-base',
  },
};

export default function SkillBubble({ 
  skill, 
  endorsementCount = 0, 
  skillLevel = 'beginner', 
  onClick,
  className = "",
  animated = true 
}) {
  const levelConfig = skillLevels[skillLevel];
  const IconComponent = levelConfig.icon;

  const bubbleVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: animated ? 5 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const floatingVariants = animated ? {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } : {};

  return (
    <motion.div
      variants={bubbleVariants}
      initial="idle"
      animate={animated ? "animate" : "idle"}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={`relative cursor-pointer ${className}`}
      {...floatingVariants}
    >
      <div className={`${levelConfig.size} relative`}>
        {/* Main bubble */}
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${levelConfig.color} 
                        shadow-lg flex items-center justify-center relative overflow-hidden`}>
          
          {/* Skill level icon */}
          {IconComponent && (
            <div className="absolute top-1 right-1 text-white/80">
              <IconComponent size={12} />
            </div>
          )}
          
          {/* Skill name */}
          <span className={`text-white font-semibold text-center px-2 ${levelConfig.textSize} leading-tight`}>
            {skill}
          </span>
          
          {/* Shimmer effect for godmode */}
          {skillLevel === 'godmode' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: [-100, 200],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
              style={{
                transform: "rotate(45deg)",
              }}
            />
          )}
        </div>
        
        {/* Endorsement count badge */}
        {endorsementCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1"
          >
            <Badge 
              variant="secondary" 
              className="bg-white text-purple-900 font-bold text-xs px-2 py-1 shadow-md"
            >
              {endorsementCount}
            </Badge>
          </motion.div>
        )}
        
        {/* Pulsing ring for new endorsements */}
        {animated && endorsementCount > 0 && (
          <motion.div
            className={`absolute inset-0 rounded-full border-2 border-white/50`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}