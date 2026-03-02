import { useEffect, useMemo, useRef, useState } from 'react';
import { RadarBlip } from '../types/models';

const BLIP_LIFETIME = 4200;

export function RadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blipsRef = useRef<RadarBlip[]>([]);
  const [blipCount, setBlipCount] = useState(0);

  useEffect(() => {
    const spawnTimer = window.setInterval(() => {
      blipsRef.current = [
        ...blipsRef.current,
        {
          id: crypto.randomUUID(),
          angle: Math.random() * Math.PI * 2,
          radius: 16 + Math.random() * 110,
          createdAt: Date.now(),
          strength: 0.5 + Math.random() * 0.5,
        },
      ];
      setBlipCount(blipsRef.current.length);
    }, 850);

    let sweep = 0;
    let animationFrame = 0;

    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const now = Date.now();
      blipsRef.current = blipsRef.current.filter((blip) => now - blip.createdAt < BLIP_LIFETIME);
      setBlipCount(blipsRef.current.length);

      const { width, height } = canvas;
      const center = { x: width / 2, y: height / 2 };
      const radius = Math.min(width, height) * 0.45;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#041420';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(124,255,77,0.2)';
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

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(sweep);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, 'rgba(124,255,77,0)');
      gradient.addColorStop(1, 'rgba(124,255,77,0.2)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, -0.24, 0.24);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      blipsRef.current.forEach((blip) => {
        const life = (now - blip.createdAt) / BLIP_LIFETIME;
        const alpha = Math.max(0, (1 - life) * blip.strength);
        const x = center.x + Math.cos(blip.angle) * blip.radius;
        const y = center.y + Math.sin(blip.angle) * blip.radius;

        ctx.fillStyle = `rgba(255,179,71,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.5 + alpha * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      sweep += 0.02;
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      window.clearInterval(spawnTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const status = useMemo(() => {
    if (blipCount > 6) return 'ALTA ACTIVIDAD';
    if (blipCount > 2) return 'ACTIVIDAD MODERADA';
    return 'SECTOR ESTABLE';
  }, [blipCount]);

  return (
    <section className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-2 shadow-hud">
      <header className="mb-2 flex items-center justify-between font-mono text-xs text-tactical-neon">
        <span>RADAR SCANNER</span>
        <span>{status}</span>
      </header>
      <canvas ref={canvasRef} width={270} height={270} className="mx-auto rounded-full border border-tactical-neon/20" />
    </section>
  );
}
