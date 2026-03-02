import { create } from 'zustand';
import { MissionLog, Point, Unit, UnitCommand } from '../types/models';

interface BattleState {
  units: Unit[];
  selectedUnitId: string | null;
  missionLogs: MissionLog[];
  selectUnit: (id: string | null) => void;
  moveUnit: (id: string, destination: Point) => void;
  tick: (deltaSeconds: number) => void;
  issueCommand: (id: string, command: UnitCommand) => void;
  addLog: (message: string) => void;
}

const initialUnits: Unit[] = [
  {
    id: 'alpha-1',
    callsign: 'ALPHA-1',
    team: 'friendly',
    position: { x: 180, y: 140 },
    destination: { x: 180, y: 140 },
    velocity: 28,
    health: 100,
    morale: 91,
    ammo: 80,
    status: 'defend',
  },
  {
    id: 'bravo-2',
    callsign: 'BRAVO-2',
    team: 'friendly',
    position: { x: 360, y: 220 },
    destination: { x: 360, y: 220 },
    velocity: 34,
    health: 95,
    morale: 85,
    ammo: 64,
    status: 'recon',
  },
  {
    id: 'red-6',
    callsign: 'RED-6',
    team: 'enemy',
    position: { x: 600, y: 370 },
    destination: { x: 600, y: 370 },
    velocity: 20,
    health: 100,
    morale: 78,
    ammo: 70,
    status: 'attack',
  },
];

const clock = () => new Date().toISOString().substring(11, 19);

export const useBattleStore = create<BattleState>((set) => ({
  units: initialUnits,
  selectedUnitId: 'alpha-1',
  missionLogs: [{ id: crypto.randomUUID(), timestamp: clock(), message: 'COMMAND LINK ESTABLISHED' }],
  selectUnit: (id) => set({ selectedUnitId: id }),
  moveUnit: (id, destination) =>
    set((state) => ({
      units: state.units.map((unit) =>
        unit.id === id ? { ...unit, destination, status: 'move' } : unit,
      ),
      missionLogs: [
        ...state.missionLogs,
        {
          id: crypto.randomUUID(),
          timestamp: clock(),
          message: `WAYPOINT SET for ${id.toUpperCase()} (${Math.round(destination.x)},${Math.round(
            destination.y,
          )})`,
        },
      ],
    })),
  issueCommand: (id, command) =>
    set((state) => ({
      units: state.units.map((unit) => (unit.id === id ? { ...unit, status: command } : unit)),
      missionLogs: [
        ...state.missionLogs,
        { id: crypto.randomUUID(), timestamp: clock(), message: `${id.toUpperCase()} => ${command.toUpperCase()}` },
      ],
    })),
  tick: (deltaSeconds) =>
    set((state) => ({
      units: state.units.map((unit) => {
        const dx = unit.destination.x - unit.position.x;
        const dy = unit.destination.y - unit.position.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 0.5) {
          return unit;
        }

        const step = Math.min(distance, unit.velocity * deltaSeconds);
        return {
          ...unit,
          position: {
            x: unit.position.x + (dx / distance) * step,
            y: unit.position.y + (dy / distance) * step,
          },
        };
      }),
    })),
  addLog: (message) =>
    set((state) => ({
      missionLogs: [...state.missionLogs, { id: crypto.randomUUID(), timestamp: clock(), message }],
    })),
}));
