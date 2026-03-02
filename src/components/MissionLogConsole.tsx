import { useEffect, useMemo, useRef, useState } from 'react';
import { useBattleStore } from '../store/useBattleStore';

export function MissionLogConsole() {
  const logs = useBattleStore((state) => state.missionLogs);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const latestMessage = logs.at(-1)?.message ?? '';
  const [typed, setTyped] = useState('');

  useEffect(() => {
    setTyped('');
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(latestMessage.slice(0, i));
      if (i >= latestMessage.length) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [latestMessage]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const shown = useMemo(() => logs.slice(-12), [logs]);

  const levelColor: Record<string, string> = {
    info: 'text-tactical-neon',
    warning: 'text-tactical-amber',
    critical: 'text-red-400',
  };

  return (
    <section className="rounded-xl border border-tactical-amber/40 bg-black/60 p-3 shadow-hud">
      <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-tactical-amber">MISSION LOG CONSOLE</h2>
      <div ref={containerRef} className="h-40 space-y-1 overflow-y-auto rounded bg-black/40 p-2 font-mono text-xs">
        {shown.map((log, idx) => (
          <p key={log.id} className={levelColor[log.level]}>
            [{log.timestamp}] {idx === shown.length - 1 ? typed : log.message}
          </p>
        ))}
      </div>
    </section>
  );
}
