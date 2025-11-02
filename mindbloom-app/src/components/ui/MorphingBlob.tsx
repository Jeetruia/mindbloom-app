/**
 * MorphingBlob - Animated morphing blob background
 */
import React, { useEffect, useRef } from 'react';

interface MorphingBlobProps {
  color?: string;
  size?: number;
  speed?: number;
  className?: string;
}

export function MorphingBlob({
  color = '#FF8FA3',
  size = 300,
  speed = 0.002,
  className = '',
}: MorphingBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawBlob = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = size / 2;
      
      ctx.beginPath();
      for (let i = 0; i < 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const noise = Math.sin(t + angle * 3) * 0.3 + Math.cos(t * 0.7 + angle * 5) * 0.2;
        const r = radius * (1 + noise);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}00`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      timeRef.current += speed;
      drawBlob(timeRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, size, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity: 0.3 }}
    />
  );
}

