# Tactical RTS Command Interface — Arquitectura y Plan

## 1) Arquitectura del sistema

El proyecto se organiza en cuatro capas:

1. **Presentación (React + Tailwind + Framer Motion)**
   - Renderiza paneles HUD, consola, widgets y micro-animaciones.
2. **Simulación (Zustand)**
   - Mantiene estado global de unidades, selección, logs y eventos de airstrike.
3. **Render táctico (Canvas 2D)**
   - Dibuja mapa, grid, unidades, rutas, niebla de guerra y explosiones.
4. **Interacción**
   - Traduce input de usuario (click, drag, wheel, shift+click) en acciones de simulación.

### Flujo de datos

- El usuario interactúa con `TacticalMap` o `UnitControlPanel`.
- La acción invoca métodos de store (`moveUnit`, `issueCommand`, `callAirstrike`).
- `App` ejecuta un loop de simulación (`tick`) y limpieza de efectos (`pruneEffects`).
- Componentes Canvas y paneles se actualizan automáticamente por suscripción a Zustand.

## 2) Estructura de carpetas

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
README.md
```

## 3) Diseño de estado (Zustand)

- `units: Unit[]`
- `selectedUnitId: string | null`
- `missionLogs: MissionLog[]`
- `activeAirstrikes: AirstrikeEvent[]`
- `selectUnit(id)`
- `moveUnit(id, destination)`
- `issueCommand(id, command)`
- `callAirstrike(position)`
- `tick(deltaSeconds)`
- `pruneEffects()`

## 4) Modelos de datos

- `Unit`: identidad táctica, team, posición, destino, recursos y visibilidad.
- `UnitCommand`: `move | attack | defend | recon`.
- `MissionLog`: timestamp, mensaje y severidad (`info/warning/critical`).
- `RadarBlip`: detección temporal para radar con intensidad.
- `AirstrikeEvent`: punto de impacto, radio y vida útil para FX.

## 5) Plan de construcción paso a paso

1. Inicializar proyecto React + TS + Tailwind + Framer Motion + Zustand.
2. Definir tipos de dominio en `models.ts`.
3. Construir store con acciones y simulación base.
4. Implementar Canvas de mapa con pan/zoom y selección.
5. Añadir niebla de guerra y rutas de movimiento.
6. Integrar control panel y consola de misión.
7. Implementar radar con sweep y blips con desvanecimiento.
8. Implementar airstrike (input + daño + animación + logs).
9. Pulir tema visual HUD y micro-animaciones.

## 6) Estado actual del starter implementado

Incluye:
- Mapa táctico interactivo (selección, movimiento, pan/zoom, fog, rutas).
- Radar en Canvas con sweep continuo y blips dinámicos.
- Panel de control de unidad con métricas y comandos.
- Consola tipo terminal con autoscroll y typing effect.
- Simulación de airstrike con daño radial + logs críticos.

Siguiente iteración sugerida:
- Pathfinding por waypoints y obstáculos.
- IA enemiga ligera (patrol, engage, fallback).
- Escenarios con objetivos y condiciones de victoria/derrota.
