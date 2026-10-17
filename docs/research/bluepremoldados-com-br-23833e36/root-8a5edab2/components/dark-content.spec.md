# DarkContent Specification

## Overview
- Target: `Management`, `Audiences`, `About`, `Regions`, and `FAQ` in `src/App.tsx` with shared CSS.
- Screenshots: `desktop-section-08.png` through `desktop-section-10.png`.
- Interaction model: reveal-on-scroll; FAQ click-driven.

## Visual rules
- Primary dark band: `#001c2a`; secondary footer dark: `#00151f`.
- Dark-section heading: 64px/65px, weight 740, white; eyebrow cyan-muted with yellow rule.
- Benefits appear in equal columns divided by 1px white/12% lines; cyan icons, yellow micro-labels, muted blue-gray copy.
- About returns to white and uses a large image left / copy right; strong phrase split between navy and blue-cyan.
- Supporting cards use 1px `rgba(0,28,42,.14)` borders and 6–8px radii.
- Decorative large concentric circles can use borders at cyan/8% in the dark section.

## Responsive
- Desktop: two-column about, five/even benefit columns where content permits.
- Tablet: two-column cards.
- Mobile: single column; 76px vertical padding; 33.6px headings; dividers become horizontal.

## Content
- Preserve S.A management, audience, values, regions, and FAQ text.

