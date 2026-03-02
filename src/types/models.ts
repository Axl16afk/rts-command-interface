export type UnitTeam = 'friendly' | 'enemy';
export type UnitCommand = 'move' | 'attack' | 'defend' | 'recon';

export interface Point {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  callsign: string;
  team: UnitTeam;
  position: Point;
  destination: Point;
  velocity: number;
  health: number;
  morale: number;
  ammo: number;
  status: UnitCommand;
  isVisible: boolean;
}

export interface RadarBlip {
  id: string;
  angle: number;
  radius: number;
  createdAt: number;
  strength: number;
}

export interface MissionLog {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
}

export interface AirstrikeEvent {
  id: string;
  position: Point;
  startedAt: number;
  radius: number;
}

export interface Viewport {
  zoom: number;
  pan: Point;
}
