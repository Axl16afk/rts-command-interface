import { useEffect, useMemo, useRef, useState } from 'react';
import { RadarBlip } from '../types/models';

const BLIP_LIFETIME = 3800;

export function RadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blips, setBlips] = useState<RadarBlip[]>([]);
  const sweepRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlips((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          angle: Math.random() * Math.PI * 2,
          radius: 20 + Math.random() * 105,
          createdAt: Date.now(),
        },
      ]);
    }, 900);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const animate = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !canvasRef.current) return;

      const now = Date.now();
      setBlips((prev) => prev.filter((blip) => now - blip.createdAt < BLIP_LIFETIME));

      const { width, height } = canvasRef.current;
      const center = { x: width / 2, y: height / 2 };
      const radius = Math.min(width, height) * 0.45;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#04131f';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(124,255,77,0.25)';
      [0.25, 0.5, 0.75, 1].forEach((ring) => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius * ring, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.moveTo(center.x - radius, center.y);
      ctx.lineTo(center.x + radius, center.y);
      ctx.moveTo(center.x, center.y - radius);
      ctx.lineTo(center.x, center.y + radius);
      ctx.stroke();

      const sweep = sweepRef.current;
      const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
      grad.addColorStop(0, 'rgba(124,255,77,0.0)');
      grad.addColorStop(1, 'rgba(124,255,77,0.18)');

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(sweep);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, -0.18, 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      blips.forEach((blip) => {
        const age = now - blip.createdAt;
        const opacity = Math.max(0, 1 - age / BLIP_LIFETIME);
        const x = center.x + Math.cos(blip.angle) * blip.radius;
        const y = center.y + Math.sin(blip.angle) * blip.radius;

        ctx.fillStyle = `rgba(255,179,71,${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + opacity * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      sweepRef.current += 0.02;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [blips]);

  const enemyCount = useMemo(() => blips.length, [blips]);

  return (
    <div className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-2 shadow-hud">
      <div className="mb-2 flex items-center justify-between font-mono text-xs text-tactical-neon">
        <span>Radar Scanner</span>
        <span>BLIPS {enemyCount.toString().padStart(2, '0')}</span>
      </div>
      <canvas ref={canvasRef} width={260} height={260} className="mx-auto rounded-full border border-tactical-neon/20" />
    </div>
  );
}
