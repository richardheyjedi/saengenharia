# HeaderHero Specification

## Overview
- Target: `src/components/ReferenceHero.tsx` plus `Header` in `src/App.tsx`.
- Screenshots: `desktop-section-01.png`, `mobile-full.png`.
- Interaction model: header scroll-driven + menu click-driven; hero static with hover actions.

## Structure
- Fixed header with brand, five text links, yellow CTA, and circular mobile menu button.
- Full-bleed hero with background image, navy overlay, left-aligned content, eyebrow, H1, lead, two fact blocks, and two CTAs.

## Exact reference values
- Header desktop: fixed, 1440x92 at top; solid state 72px; z-index 1000; transition 350ms; backdrop blur 14px.
- Header solid: `rgba(0,28,42,.96)`, 1px white/8% shadow.
- Header nav: 10.88px, weight 600, white/82%; CTA 115.6x43, yellow `#f0be5b`, radius 4px.
- Mobile menu control: 46x46, circular, 1px white/32% border.
- Hero: min-height 880px desktop and 742.72px mobile; background `#001c2a`; overflow hidden; content aligned to bottom.
- Hero H1: 101.6px / 92.456px, weight 760, letter-spacing -7.112px, white with cyan line.
- Hero lead: 18.72px / 31.824px, color `#d5e3e8`.
- Hero primary hover: translateY(-2px), 250ms. Secondary: white/3% surface and white/34% border → cyan/12% surface and cyan border.
- Mobile H1 target: 48px/0.94 with approximately -3px tracking; hero content uses 20px gutters.

## Assets and content
- Use `/images/projetos/terraco-panoramico.jpg`; no Blue assets.
- Keep S.A headline, services, regions, and CTA destinations.

## Responsive
- Desktop: content max 900px with image covering viewport.
- Tablet: retain full background and reduce H1 to ~68px.
- Mobile: stack facts and actions; full-width primary action; hero min-height around 760px.

