import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface BouncingLoaderProps {
  onAnimationComplete?: () => void; // 消失动画完成后的回调
  onExit?: (callback: () => void) => void; // 父组件注册退出动画的句柄
}

const BouncingLoader: React.FC<BouncingLoaderProps> = ({ onAnimationComplete, onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  // 使用 useGSAP hook 来确保动画在组件生命周期内正确管理
  useGSAP(() => {
    // 1. 小方块滚动动画 (Rolling Square)
    // 顺时针旋转 90 度，配合 Y 轴位移模拟“翻滚”时的重心升降
    const rollTl = gsap.timeline({ repeat: -1 });
    
    rollTl
      .to(boxRef.current, {
        rotation: "+=90", // 每次旋转 90 度
        duration: 0.6,
        ease: "power2.inOut",
      }, 0)
      .to(boxRef.current, {
        y: -10, // 向上跳起（模拟翻滚时重心升高）
        duration: 0.3,
        ease: "power2.out",
        yoyo: true, // 自动返回原位
        repeat: 1,  // 对应旋转的前半段上升，后半段下降
      }, 0);

    // 2. 地面移动动画 (Moving Ground)
    // 模拟地面向后移动，产生方块向前滚动的视觉错觉
    // 移动距离大约为一个字符的宽度，无限循环以产生连续感
    gsap.to(groundRef.current, {
      x: -14, // 约等于一个 dash 的宽度 (取决于字体大小和字间距)
      duration: 0.15,
      ease: "none",
      repeat: -1,
    });

    // 注册退出动画句柄给父组件
    if (onExit) {
      onExit(() => {
        // 退出动画：淡出并缩小
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            onAnimationComplete?.();
          },
        });
      });
    }
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground"
    >
      {/* 滚动的小方块 */}
      <div 
        ref={boxRef}
        className="w-6 h-6 bg-primary rounded-sm mb-2 shadow-sm"
      />

      {/* 滚动的地面文字 */}
      <div className="overflow-hidden w-64 flex justify-center mask-image-gradient">
        <div 
          ref={groundRef} 
          className="font-mono text-muted-foreground text-xl tracking-[0.2em] whitespace-nowrap select-none"
        >
          ----------------------------------------
        </div>
      </div>
    </div>
  );
};

export default BouncingLoader;