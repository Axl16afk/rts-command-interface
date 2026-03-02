import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useBattleStore } from '../store/useBattleStore';

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

export function TacticalMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: -130, y: -80 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });

  const units = useBattleStore((state) => state.units);
  const selectedUnitId = useBattleStore((state) => state.selectedUnitId);
  const activeAirstrikes = useBattleStore((state) => state.activeAirstrikes);
  const selectUnit = useBattleStore((state) => state.selectUnit);
  const moveUnit = useBattleStore((state) => state.moveUnit);
  const callAirstrike = useBattleStore((state) => state.callAirstrike);

  const screenToMap = (screenX: number, screenY: number) => ({
    x: (screenX - pan.x) / zoom,
    y: (screenY - pan.y) / zoom,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#02060f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    ctx.strokeStyle = 'rgba(124,255,77,0.18)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= MAP_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= MAP_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }

    units.forEach((unit) => {
      if (!unit.isVisible && unit.team === 'enemy') return;

      ctx.fillStyle = unit.team === 'friendly' ? '#7CFF4D' : '#ff6b6b';
      ctx.beginPath();
      ctx.arc(unit.position.x, unit.position.y, 7, 0, Math.PI * 2);
      ctx.fill();

      if (unit.id === selectedUnitId) {
        ctx.strokeStyle = '#ffb347';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(unit.position.x, unit.position.y, 13, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(124,255,77,0.6)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(unit.position.x, unit.position.y);
      ctx.lineTo(unit.destination.x, unit.destination.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    activeAirstrikes.forEach((event) => {
      const age = Date.now() - event.startedAt;
      const progress = Math.min(1, age / 900);
      ctx.fillStyle = `rgba(255,120,60,${1 - progress})`;
      ctx.beginPath();
      ctx.arc(event.position.x, event.position.y, event.radius * progress, 0, Math.PI * 2);
      ctx.fill();
    });

    const fog = ctx.createRadialGradient(MAP_WIDTH * 0.55, MAP_HEIGHT * 0.5, 220, MAP_WIDTH * 0.55, MAP_HEIGHT * 0.5, 700);
    fog.addColorStop(0, 'rgba(0,0,0,0.1)');
    fog.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    ctx.restore();
  }, [units, selectedUnitId, zoom, pan, activeAirstrikes]);

  const onCanvasClick = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const target = screenToMap(event.clientX - rect.left, event.clientY - rect.top);

    const clicked = units.find((unit) => Math.hypot(unit.position.x - target.x, unit.position.y - target.y) < 12);
    if (clicked) {
      selectUnit(clicked.id);
      return;
    }

    if (event.shiftKey) {
      callAirstrike(target);
      return;
    }

    if (selectedUnitId) {
      moveUnit(selectedUnitId, target);
    }
  };

  return (
    <section className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-2 shadow-hud">
      <header className="mb-2 flex items-center justify-between font-mono text-xs text-tactical-neon">
        <span>TACTICAL MAP</span>
        <span>ZOOM {Math.round(zoom * 100)}% · SHIFT+CLICK AIRSTRIKE</span>
      </header>
      <canvas
        ref={canvasRef}
        width={920}
        height={520}
        className="w-full cursor-crosshair rounded border border-tactical-neon/20"
        onWheel={(event) => {
          event.preventDefault();
          const delta = event.deltaY > 0 ? -0.1 : 0.1;
          setZoom((prev) => Math.max(0.55, Math.min(2.6, prev + delta)));
        }}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          setIsPanning(true);
          setDragOrigin({ x: event.clientX - pan.x, y: event.clientY - pan.y });
        }}
        onMouseMove={(event) => {
          if (!isPanning) return;
          setPan({ x: event.clientX - dragOrigin.x, y: event.clientY - dragOrigin.y });
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
        onClick={onCanvasClick}
      />
    </section>
  );
}
