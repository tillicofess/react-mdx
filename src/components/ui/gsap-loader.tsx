import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface BouncingLoaderProps {
  onAnimationComplete?: () => void; // 消失动画完成后的回调
  onExit?: (callback: () => void) => void; // 父组件注册退出动画的句柄
}

const BouncingLoader: React.FC<BouncingLoaderProps> = ({ onAnimationComplete, onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLDivElement[]>([]);

  // 使用 useGSAP hook 来确保动画在组件生命周期内正确管理
  useGSAP(() => {
    // 入场动画：小球循环跳动
    gsap.to(dotRefs.current, {
      y: -20, // 向上跳跃
      stagger: 0.15, // 每个小球依次跳跃
      duration: 0.4,
      repeat: -1, // 无限循环
      yoyo: true, // 来回动画
      ease: 'power1.inOut',
    });

    // 注册退出动画句柄给父组件
    if (onExit) {
      onExit(() => {
        // 退出动画：所有小球向下落并淡出
        gsap.to(dotRefs.current, {
          y: 50, // 向下落
          opacity: 0, // 淡出
          stagger: 0.1,
          duration: 0.5,
          ease: 'power1.in',
          onComplete: () => {
            console.log('Loader exit animation complete!');
            // 退出动画完成后，执行父组件的回调
            onAnimationComplete?.();
          },
        });
      });
    }
  }, { scope: containerRef }); // 动画作用域限制在 containerRef 内

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // 博客的背景色
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            ref={(el) => { if (el) dotRefs.current[index] = el; }}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#1890ff', // 蓝色
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BouncingLoader;