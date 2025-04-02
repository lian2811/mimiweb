"use client";

import FutureVisionContent from "./FutureVisionContent";

export default function FutureVision() {

  // 動畫變體
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const floatAnimation = {
    hidden: { y: 0 },
    visible: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <FutureVisionContent 
      fadeIn={fadeIn}
      staggerContainer={staggerContainer}
      floatAnimation={floatAnimation}
    />
  );
}