import { create } from 'zustand';
import { AirstrikeEvent, MissionLog, Point, Unit, UnitCommand } from '../types/models';

interface BattleState {
  units: Unit[];
  selectedUnitId: string | null;
  missionLogs: MissionLog[];
  activeAirstrikes: AirstrikeEvent[];
  selectUnit: (id: string | null) => void;
  moveUnit: (id: string, destination: Point) => void;
  issueCommand: (id: string, command: UnitCommand) => void;
  callAirstrike: (position: Point) => void;
  tick: (deltaSeconds: number) => void;
  pruneEffects: () => void;
}

const MAP_BOUNDS = { width: 1200, height: 800 };
const AIRSTRIKE_RADIUS = 90;
const AIRSTRIKE_DURATION = 1000;

const nowClock = () => new Date().toISOString().substring(11, 19);

const initialUnits: Unit[] = [
  {
    id: 'alpha-1',
    callsign: 'ALPHA-1',
    team: 'friendly',
    position: { x: 180, y: 160 },
    destination: { x: 180, y: 160 },
    velocity: 28,
    health: 100,
    morale: 94,
    ammo: 80,
    status: 'defend',
    isVisible: true,
  },
  {
    id: 'bravo-2',
    callsign: 'BRAVO-2',
    team: 'friendly',
    position: { x: 300, y: 250 },
    destination: { x: 300, y: 250 },
    velocity: 33,
    health: 95,
    morale: 88,
    ammo: 70,
    status: 'recon',
    isVisible: true,
  },
  {
    id: 'red-6',
    callsign: 'RED-6',
    team: 'enemy',
    position: { x: 740, y: 420 },
    destination: { x: 740, y: 420 },
    velocity: 23,
    health: 100,
    morale: 82,
    ammo: 78,
    status: 'attack',
    isVisible: true,
  },
  {
    id: 'red-9',
    callsign: 'RED-9',
    team: 'enemy',
    position: { x: 660, y: 360 },
    destination: { x: 660, y: 360 },
    velocity: 20,
    health: 100,
    morale: 76,
    ammo: 60,
    status: 'recon',
    isVisible: false,
  },
];

const mkLog = (message: string, level: MissionLog['level'] = 'info'): MissionLog => ({
  id: crypto.randomUUID(),
  timestamp: nowClock(),
  message,
  level,
});

export const useBattleStore = create<BattleState>((set) => ({
  units: initialUnits,
  selectedUnitId: 'alpha-1',
  missionLogs: [mkLog('ENLACE DE COMANDO ESTABLECIDO')],
  activeAirstrikes: [],
  selectUnit: (id) => set({ selectedUnitId: id }),
  moveUnit: (id, destination) =>
    set((state) => ({
      units: state.units.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              destination: {
                x: Math.max(0, Math.min(MAP_BOUNDS.width, destination.x)),
                y: Math.max(0, Math.min(MAP_BOUNDS.height, destination.y)),
              },
              status: 'move',
            }
          : unit,
      ),
      missionLogs: [
        ...state.missionLogs,
        mkLog(`WAYPOINT ${id.toUpperCase()} -> (${Math.round(destination.x)},${Math.round(destination.y)})`),
      ],
    })),
  issueCommand: (id, command) =>
    set((state) => ({
      units: state.units.map((unit) => (unit.id === id ? { ...unit, status: command } : unit)),
      missionLogs: [...state.missionLogs, mkLog(`${id.toUpperCase()} => ${command.toUpperCase()}`)],
    })),
  callAirstrike: (position) =>
    set((state) => {
      const damagedUnits = state.units.map((unit) => {
        const distance = Math.hypot(unit.position.x - position.x, unit.position.y - position.y);
        if (distance > AIRSTRIKE_RADIUS) {
          return unit;
        }

        const damageRatio = 1 - distance / AIRSTRIKE_RADIUS;
        const healthDamage = Math.round(45 * damageRatio);
        const moraleDamage = Math.round(25 * damageRatio);

        return {
          ...unit,
          health: Math.max(0, unit.health - healthDamage),
          morale: Math.max(0, unit.morale - moraleDamage),
          status: unit.team === 'friendly' ? 'defend' : 'attack',
        };
      });

      return {
        units: damagedUnits,
        activeAirstrikes: [
          ...state.activeAirstrikes,
          {
            id: crypto.randomUUID(),
            position,
            startedAt: Date.now(),
            radius: AIRSTRIKE_RADIUS,
          },
        ],
        missionLogs: [
          ...state.missionLogs,
          mkLog(
            `AIRSTRIKE EN (${Math.round(position.x)},${Math.round(position.y)}) - IMPACTO CONFIRMADO`,
            'critical',
          ),
        ],
      };
    }),
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
  pruneEffects: () =>
    set((state) => ({
      activeAirstrikes: state.activeAirstrikes.filter((event) => Date.now() - event.startedAt < AIRSTRIKE_DURATION),
    })),
}));
