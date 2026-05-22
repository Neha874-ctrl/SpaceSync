# SpaceSync 🚀

SpaceSync is a next-generation, collaborative 3D spatial layout design and AI optimization engine. It bridges real-time multiplayer collaboration, interactive 3D physics-constrained environments, and generative AI to instantly optimize room layouts, asset spacing, and furniture arrangements.

## ✨ Core Features
- **Immersive 3D Space & Simulation:** High-performance, 360° rotating 3D canvas locked to a procedural 1x1 ft grid with hard collision physics (via Rapier 3D).
- **Generative AI Design Companion:** A secure backend pass-through prompt router that streams conversational text feedback alongside structured JSON coordinate arrays.
- **Multiplayer Collaboration:** Low-latency WebSockets to mirror asset adjustments, item rotations, and user cursors instantly across screens.
- **Modern Bento-Grid UI:** Responsive interface featuring a custom-tailored light pink palette for light mode and a deep onyx/purple palette for dark mode.

## 🏗️ Repository Structure
```text
spacesync/
├── client/      # React + Vite frontend workspace (Tailwind CSS, Lucide Icons)
└── server/      # FastAPI backend engine (Python, WebSockets, DB routers)
