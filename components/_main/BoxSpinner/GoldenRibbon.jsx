import { motion, AnimatePresence } from "framer-motion";

/* -------------  GoldenRibbon  ------------- */
const GoldenRibbon = ({ delay = 0, duration = 4, uniqueKey }) => {
  /* random starting position inside the central 50 % of the container */
  const startLeft = 25 + Math.random() * 50; // 25 % – 75 %

  const ribbonVariants = {
    initial: {
      y: -80, // slightly above viewport
      x: 0,
      left: `${startLeft}%`,
      rotate: Math.random() * 360,
      opacity: 0, // Start fully transparent
    },
    animate: {
      y: 600, // fall through the whole card
      x: (Math.random() - 0.5) * 120, // small drift
      rotate: Math.random() * 720 + 360,
      opacity: [0, 1, 1, 0.8, 0], // Smooth fade in, stay visible, then gradual fade out
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Smooth ease-in-out
        opacity: {
          duration,
          times: [0, 0.1, 0.7, 0.9, 1], // Gradual fade in/out
          ease: "easeInOut",
        },
      },
    },
  };

  const ribbonStyle = {
    position: "absolute",
    width: Math.random() * 6 + 3, // 5-11px width
    height: Math.random() * 14 + 10,
    background: `linear-gradient(45deg,#FFD700,#FFA500,#FFFF00,#FFD700,#DAA520)`,
    borderRadius: "2px",
    boxShadow: "0 0 4px rgba(255,215,0,0.7)",
  };

  return (
    <motion.div
      key={uniqueKey}
      className="pointer-events-none"
      style={ribbonStyle}
      variants={ribbonVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0 }} // Smooth exit animation
    />
  );
};

export default GoldenRibbon;
