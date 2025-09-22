"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoldenRibbon from "./GoldenRibbon";

/* -------------  GoldenConfetti  ------------- */
const GoldenConfetti = ({ isActive }) => {
  const [ribbons, setRibbons] = useState([]);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsStopping(true);
      // Let existing ribbons finish their animation naturally
      const timer = setTimeout(() => {
        setRibbons([]);
        setIsStopping(false);
      }, 5000); // Wait for all ribbons to finish animating
      return () => clearTimeout(timer);
    }

    setIsStopping(false);

    const createRibbons = () => {
      const newRibbons = [];
      for (let i = 0; i < 20; i++) {
        newRibbons.push({
          id: `ribbon-${Date.now()}-${i}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          delay: Math.random() * 2,
          duration: Math.random() * 1 + 3.5,
        });
      }
      setRibbons(newRibbons);
    };

    createRibbons();

    const interval = setInterval(() => {
      if (!isActive || isStopping) return;

      const additional = Array.from({ length: 10 }, (_, i) => ({
        id: `ribbon-${Date.now()}-${i}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        delay: Math.random() * 1.2,
        duration: Math.random() * 1 + 3.5,
      }));
      setRibbons((prev) => {
        // Keep only the most recent ribbons to prevent memory issues
        const recentRibbons = prev.slice(-30);
        return [...recentRibbons, ...additional];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, isStopping]);

  if (!isActive && ribbons.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <AnimatePresence>
        {ribbons.map((r) => (
          <GoldenRibbon
            key={r.id}
            uniqueKey={r.id}
            delay={r.delay}
            duration={r.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GoldenConfetti;
