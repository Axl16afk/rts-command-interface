# Tactical RTS Command Interface (Frontend Simulation)

Interfaz táctica estilo militar/cinemática, sin backend, construida con:

- React + TypeScript
- TailwindCSS
- Framer Motion
- HTML Canvas (mapa + radar)
- Zustand (estado/simulación)

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Features implementadas

- **Tactical Map**
  - Grid táctico estilizado
  - Unidades moviéndose en tiempo real
  - Click para seleccionar unidad
  - Click para emitir waypoint
  - Drag para pan
  - Scroll para zoom
  - Niebla de guerra visual
  - Shift + click para airstrike
- **Unit Control Panel**
  - Health / morale / ammo
  - Estado actual
  - Comandos: Move, Attack, Defend, Recon
  - Transiciones con Framer Motion
- **Radar Scanner**
  - Sweep circular animado
  - Blips enemigos aleatorios
  - Fade temporal de blips
- **Mission Log Console**
  - Estilo terminal
  - Logs con timestamp
  - Autoscroll
  - Typing animation
- **Airstrike Simulation**
  - Selección de coordenada en mapa
  - Explosión visual en canvas
  - Daño radial en unidades cercanas

## Documentación

- Arquitectura, modelos de datos y plan de construcción: `docs/system-design.md`.
