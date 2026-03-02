import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MissionLogConsole } from './components/MissionLogConsole';
import { RadarScanner } from './components/RadarScanner';
import { TacticalMap } from './components/TacticalMap';
import { UnitControlPanel } from './components/UnitControlPanel';
import { useBattleStore } from './store/useBattleStore';

export function App() {
  const tick = useBattleStore((state) => state.tick);
  const pruneEffects = useBattleStore((state) => state.pruneEffects);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      tick((now - last) / 1000);
      pruneEffects();
      last = now;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick, pruneEffects]);

  return (
    <div className="min-h-screen bg-tactical-bg p-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,255,77,0.06),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,179,71,0.05),transparent_25%)]" />
      <main className="relative mx-auto grid max-w-7xl gap-4 lg:grid-cols-[2.15fr_1fr]">
        <section className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-glitch font-mono text-lg tracking-[0.22em] text-tactical-neon"
          >
            TACTICAL RTS COMMAND INTERFACE
          </motion.h1>
          <TacticalMap />
          <MissionLogConsole />
        </section>

        <aside className="space-y-4">
          <UnitControlPanel />
          <RadarScanner />
          <div className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-3 font-mono text-xs text-slate-300 shadow-hud">
            <p className="text-tactical-neon">HUD TIPS</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Click unidad para seleccionar</li>
              <li>Click mapa para mover unidad</li>
              <li>Shift + Click para solicitar airstrike</li>
              <li>Scroll para zoom, drag para pan</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
