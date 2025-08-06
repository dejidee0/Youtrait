"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Award, Zap } from "lucide-react";
import BubbleBackground from "@/components/ui/bubble-background";
import { useRouter } from "next/navigation";

const welcomeSlides = [
  {
    icon: Users,
    title: "Welcome to YOUTRAIT",
    subtitle: "Where Skills Come Alive",
    description:
      "Transform your professional profile into an interactive universe of animated skill bubbles that showcase your expertise like never before.",
  },
  {
    icon: Award,
    title: "Get Endorsed & Rise",
    subtitle: "From Beginner to Godmode",
    description:
      "Watch your skills evolve from tiny bubbles to massive orbs as colleagues endorse your expertise. Climb the ranks: Beginner → Intermediate → Expert → Godmode.",
  },
  {
    icon: Zap,
    title: "Connect & Collaborate",
    subtitle: "Network Through Skills",
    description:
      "Discover professionals through shared skills, endorse each other's expertise, and build meaningful connections in your field.",
  },
];

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = () => {
    if (currentSlide < welcomeSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/register");
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 300 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative flex flex-col">
      <BubbleBackground density={15} />

      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-white"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                {welcomeSlides[currentSlide].icon && (
                  <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                    {React.createElement(welcomeSlides[currentSlide].icon, {
                      size: 48,
                      className: "text-white",
                    })}
                  </div>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl font-bold mb-3"
              >
                {welcomeSlides[currentSlide].title}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl font-medium mb-6 text-purple-200"
              >
                {welcomeSlides[currentSlide].subtitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg leading-relaxed text-purple-100"
              >
                {welcomeSlides[currentSlide].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 p-8">
        <div className="flex justify-center space-x-2 mb-8">
          {welcomeSlides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              layoutId={`indicator-${index}`}
            />
          ))}
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={nextSlide}
            className="w-full bg-white text-purple-900 hover:bg-purple-50 py-6 text-lg font-semibold rounded-xl"
            size="lg"
          >
            {currentSlide === welcomeSlides.length - 1
              ? "Get Started"
              : "Continue"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
