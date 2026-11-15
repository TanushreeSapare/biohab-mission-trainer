# BioHab: Junior Astronaut Mission Trainer

An interactive, browser-playable resource-management simulation built for the **2026 NASA International Space Apps Challenge**, designed to help students ages 7–12 explore the real engineering and biological trade-offs of running a Lunar or Martian outpost over a 10-Sol mission.

## Overview
Young astronauts balance three interconnected survival systems against real space hazards like lunar dust accumulation, deep shadows, and solar storms:
* **Power (kW):** Solar array generation, grow-light energy demands, and active shielding power draw.
* **Bioregenerative Life Support (O2, Water & Crops):** Closed-loop hydroponics and algae bioreactors modeled on NASA's ISS Veggie and ECLSS systems.
* **Radiation & Habitat Shielding:** Regolith barriers, recycled greywater wall bladders, and active magnetic/power protection.

Every tactical decision previews its exact resource trade-offs before execution, animates the live outpost cross-section, and shares bite-sized NASA science explanations alongside non-punitive failure diagnostics.

## NASA Science & Resources Referenced
* **NASA Artemis Program:** Lunar South Pole solar illumination constraints and regolith radiation protection.
* **NASA ISS Veggie & Advanced Plant Habitat:** Red/blue LED wavelength optimization and closed-loop $O_2$/$CO_2$ exchange.
* **NASA ECLSS (Environmental Control and Life Support System):** Closed-loop water recycling and oxygen generation.

## Tech Stack
* **Frontend:** React, TypeScript, HTML5, Tailwind CSS
* **Visuals & Audio:** Custom responsive inline SVGs, Lucide icons, Web Audio API
* **Development & Hosting:** Built with Google AI Studio (Gemini) and hosted on GitHub / `.ai.studio`

## Local Setup
```bash
npm install
npm run dev
