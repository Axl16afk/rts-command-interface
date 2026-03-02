import { useEffect } from 'react';
import { MissionLogConsole } from './components/MissionLogConsole';
import { RadarScanner } from './components/RadarScanner';
import { TacticalMap } from './components/TacticalMap';
import { UnitControlPanel } from './components/UnitControlPanel';
import { useBattleStore } from './store/useBattleStore';

export function App() {
  const tick = useBattleStore((state) => state.tick);

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      tick((now - last) / 1000);
      last = now;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, [tick]);

  return (
    <div className="min-h-screen bg-tactical-bg p-4 text-white">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h1 className="animate-glitch font-mono text-lg tracking-widest text-tactical-neon">Tactical RTS Command Interface</h1>
          <TacticalMap />
          <MissionLogConsole />
        </div>
        <div className="space-y-4">
          <UnitControlPanel />
          <RadarScanner />
        </div>
      </div>
    </div>
  );
}
