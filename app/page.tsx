"use client";

import { usePathname } from "next/navigation";
import HomeContent from "./HomeContent";

export default function Home() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

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
      locale={locale}
      fadeIn={fadeIn}
      staggerContainer={staggerContainer}
    />
  );
}