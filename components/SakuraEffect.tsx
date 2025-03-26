"use client";

import { useEffect, useState, useRef } from 'react';
import styles from './SakuraEffect.module.css';

interface SakuraPetal {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  opacity: number;
}

export default function SakuraEffect() {
  const [petals, setPetals] = useState<SakuraPetal[]>([]);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 初始化櫻花花瓣
    const initialPetalCount = 12;  // 初始櫻花花瓣數量
    const newPetals: SakuraPetal[] = [];
    
    for (let i = 0; i < initialPetalCount; i++) {
      newPetals.push(createPetal(i));
    }
    
    setPetals(newPetals);

    // 使用漸進式添加花瓣而不是一次性重建所有花瓣
    let lastPetalTime = Date.now();
    let petalId = initialPetalCount;

    const addPetalsOverTime = () => {
 
      const now = Date.now();
      
      // 每 800ms 添加一片新花瓣
      if (now - lastPetalTime > 800) {
        setPetals(prev => {
          // 移除過多的花瓣以保持性能
          const filtered = prev.filter(p => p.delay < 15); // 確保延遲小於 15s 的花瓣
          const updated = [...filtered];
          if (updated.length < 20) { // 限制最多 20 片花瓣
            updated.push(createPetal(petalId++));
          }
          return updated;
        });
        lastPetalTime = now;
      }

      animationFrameId.current = requestAnimationFrame(addPetalsOverTime);
    };

    addPetalsOverTime();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mounted]);

  // 創建單個花瓣
  const createPetal = (id: number): SakuraPetal => {
    return {
      id,
      left: Math.random() * 100,
      size: 5 + Math.random() * 12,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 10,
      rotation: Math.random() * 360,
      opacity: 0.6 + Math.random() * 0.4,
    };
  };

  if (!mounted || petals.length === 0) return null;

  return (
    <div className={styles.sakuraContainer}>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={styles.sakura}
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            transform: `rotate(${petal.rotation}deg)`,
            opacity: petal.opacity,
          }}
        />
      ))}
    </div>
  );
}