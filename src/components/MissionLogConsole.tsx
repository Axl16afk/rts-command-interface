import { useEffect, useMemo, useRef, useState } from 'react';
import { useBattleStore } from '../store/useBattleStore';

export function MissionLogConsole() {
  const logs = useBattleStore((state) => state.missionLogs);
  const ref = useRef<HTMLDivElement | null>(null);
  const latest = logs.at(-1)?.message ?? '';
  const [typed, setTyped] = useState('');

  useEffect(() => {
    setTyped('');
    let index = 0;
    const t = setInterval(() => {
      index += 1;
      setTyped(latest.slice(0, index));
      if (index >= latest.length) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [latest]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const shown = useMemo(() => logs.slice(-8), [logs]);

  return (
    <div className="rounded-xl border border-tactical-amber/30 bg-black/50 p-3 shadow-hud">
      <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-tactical-amber">Mission Log Console</h2>
      <div ref={ref} className="h-32 space-y-1 overflow-y-auto font-mono text-xs text-tactical-neon">
        {shown.map((log, idx) => (
          <p key={log.id}>{`[${log.timestamp}] ${idx === shown.length - 1 ? typed : log.message}`}</p>
        ))}
      </div>
    </div>
  );
}
