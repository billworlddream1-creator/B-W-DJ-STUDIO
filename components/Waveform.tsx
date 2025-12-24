
import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isPlaying: boolean;
  color: string;
}

const Waveform: React.FC<WaveformProps> = ({ isPlaying, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bars: number[] = Array.from({ length: 100 }, () => Math.random() * 0.5 + 0.1);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars.length;
      
      bars.forEach((val, i) => {
        if (isPlaying) {
          // Add some jitter
          bars[i] = Math.max(0.1, Math.min(1, val + (Math.random() - 0.5) * 0.1));
        }
        
        const h = bars[i] * canvas.height;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(i * barWidth, (canvas.height - h) / 2, barWidth - 1, h);
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, color]);

  return <canvas ref={canvasRef} width={400} height={64} className="w-full h-full opacity-60" />;
};

export default Waveform;
