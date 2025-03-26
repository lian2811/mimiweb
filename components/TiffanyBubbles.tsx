"use client";

import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  left: number;
  bottom: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function TiffanyBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 創建泡泡
    const createBubbles = () => {
      const newBubbles: Bubble[] = [];
      const bubbleCount = 10; // 泡泡數量

      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: Date.now() + i,
          left: Math.random() * 100, // 水平位置 (0-100%)
          bottom: -10, // 起始位置在底部以下
          size: 5 + Math.random() * 20, // 大小 (5-25px)
          opacity: 0.1 + Math.random() * 0.3, // 透明度 (0.1-0.4)
          duration: 5 + Math.random() * 10, // 動畫持續時間 (5-15s)
          delay: Math.random() * 5, // 延遲時間 (0-5s)
        });
      }

      setBubbles(prev => [...prev, ...newBubbles]);
    };

    createBubbles();

    // 定期創建新泡泡
    const interval = setInterval(() => {
      createBubbles();
      
      // 限制泡泡總數，防止性能問題
      setBubbles(prev => {
        if (prev.length > 50) {
          return prev.slice(prev.length - 50);
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [ mounted]);

  if (!mounted || bubbles.length === 0) return null;

  return (
    <>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="tiffany-bubble"
          style={{
            left: `${bubble.left}%`,
            bottom: `${bubble.bottom}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </>
  );
}