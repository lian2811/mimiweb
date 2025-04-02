"use client";

import HomeContent from "./HomeContent";

export default function Home() {

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

  return (
    <HomeContent 
      fadeIn={fadeIn}
      staggerContainer={staggerContainer}
    />
  );
}