import { useEffect, useRef, useState } from 'react';
import { useBattleStore } from '../store/useBattleStore';

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

export function TacticalMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });

  const units = useBattleStore((state) => state.units);
  const selectedUnitId = useBattleStore((state) => state.selectedUnitId);
  const selectUnit = useBattleStore((state) => state.selectUnit);
  const moveUnit = useBattleStore((state) => state.moveUnit);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    const { width, height } = canvasRef.current;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#030913';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    ctx.strokeStyle = 'rgba(124, 255, 77, 0.2)';
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

    for (const unit of units) {
      ctx.fillStyle = unit.team === 'friendly' ? '#7CFF4D' : '#ff7a7a';
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
    }

    const gradient = ctx.createRadialGradient(
      MAP_WIDTH * 0.5,
      MAP_HEIGHT * 0.5,
      200,
      MAP_WIDTH * 0.5,
      MAP_HEIGHT * 0.5,
      620,
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.72)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    ctx.restore();
  }, [units, selectedUnitId, scale, offset]);

  const screenToMap = (screenX: number, screenY: number) => ({
    x: (screenX - offset.x) / scale,
    y: (screenY - offset.y) / scale,
  });

  const onMapClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const map = screenToMap(event.clientX - rect.left, event.clientY - rect.top);

    const clickedUnit = units.find((unit) => Math.hypot(unit.position.x - map.x, unit.position.y - map.y) < 12);
    if (clickedUnit) {
      selectUnit(clickedUnit.id);
      return;
    }

    if (selectedUnitId) {
      moveUnit(selectedUnitId, map);
    }
  };

  return (
    <div className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-2 shadow-hud">
      <div className="mb-2 flex items-center justify-between font-mono text-xs text-tactical-neon">
        <span>Tactical Map</span>
        <span>ZOOM {Math.round(scale * 100)}%</span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full cursor-crosshair rounded border border-tactical-neon/20"
        onWheel={(event) => {
          event.preventDefault();
          setScale((value) => Math.min(2.2, Math.max(0.6, value + (event.deltaY > 0 ? -0.1 : 0.1))));
        }}
        onMouseDown={(event) => {
          setDragging(true);
          setDragOrigin({ x: event.clientX - offset.x, y: event.clientY - offset.y });
        }}
        onMouseMove={(event) => {
          if (!dragging) return;
          setOffset({ x: event.clientX - dragOrigin.x, y: event.clientY - dragOrigin.y });
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onClick={onMapClick}
      />
    </div>
  );
}
