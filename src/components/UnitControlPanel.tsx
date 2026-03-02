import { motion } from 'framer-motion';
import { useBattleStore } from '../store/useBattleStore';
import { UnitCommand } from '../types/models';

const commands: UnitCommand[] = ['move', 'attack', 'defend', 'recon'];

export function UnitControlPanel() {
  const units = useBattleStore((state) => state.units);
  const selectedUnitId = useBattleStore((state) => state.selectedUnitId);
  const issueCommand = useBattleStore((state) => state.issueCommand);

  const selected = units.find((unit) => unit.id === selectedUnitId);

  return (
    <div className="rounded-xl border border-tactical-neon/30 bg-tactical-panel/50 p-3 shadow-hud">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-tactical-neon">Unit Control Panel</h2>
      {selected ? (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-sm text-white">{selected.callsign}</p>
          <div className="mt-3 space-y-1 font-mono text-xs text-slate-300">
            <p>Health: {selected.health}%</p>
            <p>Morale: {selected.morale}%</p>
            <p>Ammo: {selected.ammo}%</p>
            <p>Status: {selected.status.toUpperCase()}</p>
          </div>
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
        <p className="font-mono text-xs text-slate-400">Select a unit on the map.</p>
      )}
    </div>
  );
}
