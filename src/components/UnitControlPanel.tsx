import { motion } from 'framer-motion';
import { useBattleStore } from '../store/useBattleStore';
import { UnitCommand } from '../types/models';

const commands: UnitCommand[] = ['move', 'attack', 'defend', 'recon'];

const meterColor = (value: number) => (value > 65 ? 'bg-tactical-neon' : value > 35 ? 'bg-tactical-amber' : 'bg-red-500');

export function UnitControlPanel() {
  const units = useBattleStore((state) => state.units);
  const selectedUnitId = useBattleStore((state) => state.selectedUnitId);
  const issueCommand = useBattleStore((state) => state.issueCommand);

  const selected = units.find((unit) => unit.id === selectedUnitId);

  return (
    <section className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-3 shadow-hud">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-tactical-neon">UNIT CONTROL PANEL</h2>
      {selected ? (
        <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 flex items-center justify-between font-mono text-sm">
            <span className="text-white">{selected.callsign}</span>
            <span className="text-xs text-slate-400">{selected.team.toUpperCase()}</span>
          </div>

          <div className="space-y-2">
            {[
              ['Health', selected.health],
              ['Morale', selected.morale],
              ['Ammo', selected.ammo],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-300">
                  <span>{label as string}</span>
                  <span>{value as number}%</span>
                </div>
                <div className="h-2 rounded bg-black/40">
                  <div className={`h-2 rounded ${meterColor(value as number)}`} style={{ width: `${value as number}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 font-mono text-xs text-tactical-amber">STATUS: {selected.status.toUpperCase()}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {commands.map((command) => (
              <button
                key={command}
                className="rounded border border-tactical-neon/40 px-2 py-1 font-mono text-xs text-tactical-neon transition hover:bg-tactical-neon/20"
                onClick={() => issueCommand(selected.id, command)}
              >
                {command.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <p className="font-mono text-xs text-slate-400">Selecciona una unidad en el mapa táctico.</p>
      )}
    </section>
  );
}
