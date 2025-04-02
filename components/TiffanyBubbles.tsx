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
  blur?: number; // 添加模糊效果參數
  color?: string; // 添加顏色參數，增加多樣性
  scale?: number; // 添加縮放參數，用於呼吸效果
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
      const bubbleCount = 5; // 少量泡泡，與櫻花數量相近

      // 調整為真正明亮的蒂芙尼綠色系
      const bubbleColors = [
        'rgba(32, 219, 213, 0.65)',    // 明亮蒂芙尼綠 #20dbd5
        'rgba(34, 211, 205, 0.6)',     // 稍暗一點的明亮蒂芙尼綠
        'rgba(56, 226, 220, 0.7)',     // 更亮的蒂芙尼綠
        'rgba(127, 233, 230, 0.55)',   // 淡蒂芙尼綠
        'rgba(187, 247, 244, 0.5)',    // 非常淺的蒂芙尼綠
      ];

      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: Date.now() + i,
          left: Math.random() * 100, // 水平位置 (0-100%)
          bottom: -10, // 起始位置在底部以下
          size: 4 + Math.random() * 10, // 泡泡大小 (4-14px)
          opacity: 0.5 + Math.random() * 0.4, // 提高基礎透明度 (0.5-0.9)
          duration: 7 + Math.random() * 10, // 動畫持續時間 (7-17s)
          delay: Math.random() * 6, // 延遲時間 (0-6s)
          blur: 0.2 + Math.random() * 1.0, // 減少模糊效果，使泡泡更清晰
          color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)], // 隨機蒂芙尼綠色調
          scale: 0.95 + Math.random() * 0.1, // 用於呼吸效果的比例
        });
      }

      setBubbles(prev => [...prev, ...newBubbles]);
    };

    createBubbles();

    // 定期創建新泡泡，增加時間間隔
    const interval = setInterval(() => {
      createBubbles();
      
      // 更低的泡泡總數上限
      setBubbles(prev => {
        if (prev.length > 25) { // 減少最大泡泡數量到25個
          return prev.slice(prev.length - 25);
        }
        return prev;
      });
    }, 6000); // 增加產生間隔到 6 秒，減少泡泡密度

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted || bubbles.length === 0) return null;

  return (
    <>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          style={{
            position: 'fixed',
            left: `${bubble.left}%`,
            bottom: `${bubble.bottom}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            borderRadius: '50%',
            zIndex: 10,
            backgroundColor: bubble.color || 'rgba(32, 219, 213, 0.65)', // 更新為明亮蒂芙尼綠
            boxShadow: '0 0 5px rgba(32, 219, 213, 0.7) inset, 0 0 10px rgba(32, 219, 213, 0.5)', // 更亮的陰影
            filter: `blur(${bubble.blur}px)`,
            animation: `tiffanyBubbleFloat ${bubble.duration}s linear infinite ${bubble.delay}s, tiffanyBubbleBreath 4s ease-in-out infinite alternate`,
            willChange: 'transform'
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes tiffanyBubbleFloat {
          0% {
            transform: translateY(0) rotate(0);
            bottom: -10%;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            bottom: 110%;
          }
        }
        @keyframes tiffanyBubbleBreath {
          0% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}