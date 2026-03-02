# Tactical RTS Command Interface - System Design

## 1) System Architecture

- **Presentation layer (React + Tailwind + Framer Motion):** HUD panels, controls, terminal log, transitions.
- **Simulation layer (Zustand store):** unit state, mission logs, selected entity, command dispatch, movement tick updates.
- **Rendering layer (Canvas):** tactical map + fog-of-war and radar scanner animation loops.
- **Interaction layer (event handlers):** click-select, waypoint assignment, pan, zoom, command button actions.

### High-level flow
1. UI events dispatch actions into Zustand (`selectUnit`, `moveUnit`, `issueCommand`).
2. Simulation tick updates unit positions each animation frame.
3. Canvas components subscribe to state and redraw with current data.
4. Logs are appended and animated in the mission console.

## 2) Folder Structure

```txt
src/
  components/
    TacticalMap.tsx
    RadarScanner.tsx
    UnitControlPanel.tsx
    MissionLogConsole.tsx
  store/
    useBattleStore.ts
  types/
    models.ts
  App.tsx
  main.tsx
  styles.css
docs/
  system-design.md
```

## 3) State Design (Zustand)

- `units: Unit[]` - entities, current position and destination.
- `selectedUnitId: string | null` - active selection in UI.
- `missionLogs: MissionLog[]` - timestamped terminal feed.
- `selectUnit(id)` - set active unit.
- `moveUnit(id, point)` - assign waypoint and log.
- `issueCommand(id, command)` - update tactical behavior and log.
- `tick(deltaSeconds)` - deterministic movement interpolation.
- `addLog(message)` - generic mission event injection.

## 4) Data Models

- `Unit`: identity, side, movement, health, morale, ammo, status command.
- `Point`: map-space x/y coordinates.
- `RadarBlip`: spawn angle/radius and timestamp for decay.
- `MissionLog`: time + message for terminal output.
- `UnitCommand`: union of `move | attack | defend | recon`.

## 5) Step-by-step Build Plan

1. Bootstrap Vite React + TypeScript + Tailwind project.
2. Define domain models for units, logs, blips, commands.
3. Build Zustand store with actions and simulation tick.
4. Implement `TacticalMap` canvas (grid, units, selection, movement, pan/zoom, fog).
5. Implement `RadarScanner` canvas (sweep cone, random blips, fade out).
6. Add `UnitControlPanel` with Framer Motion transitions and command buttons.
7. Add terminal-style `MissionLogConsole` with auto-scroll and typing effect.
8. Integrate components in `App` with dark military theme and glitch accents.
9. Extend with airstrike overlay + damage reaction system next.

## 6) Starter Implementation Scope in this repo

Implemented now:
- Tactical map with realtime unit motion, click select/move, drag pan, zoom wheel, fog-of-war.
- Radar scanner with circular sweep animation + random fading enemy blips.
- Control panel and mission log starter for interaction testing.

Planned next iteration:
- Airstrike coordinate targeting and explosion FX.
- Better map layers and pathfinding.
- Deterministic simulation clock + scenario scripting.
