export type UnitCommand = 'move' | 'attack' | 'defend' | 'recon';

export interface Point {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  callsign: string;
  team: 'friendly' | 'enemy';
  position: Point;
  destination: Point;
  velocity: number;
  health: number;
  morale: number;
  ammo: number;
  status: UnitCommand;
}

export interface RadarBlip {
  id: string;
  angle: number;
  radius: number;
  createdAt: number;
}

export interface MissionLog {
  id: string;
  timestamp: string;
  message: string;
}
