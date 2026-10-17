# ProjectGallery Specification

## Overview
- Target: `src/components/ReferenceGallery.tsx`.
- Screenshots: `desktop-section-05.png` through `desktop-section-07.png`.
- Interaction model: click-driven carousel + thumbnails + modal lightbox; keyboard arrows/Escape.

## Structure
- Soft-gray section with split heading.
- One large active image (rounded 8px) with counter upper-left, circular arrows upper-right, and caption over bottom gradient.
- Thin cyan progress line and thumbnail rail below.
- Seven S.A project images; click main image opens lightbox.

## Exact reference values
- Section background `#f9fbfb`, vertical padding about 124px.
- Large active frame: full container width, 8px radius, approximately 1240x620 on desktop.
- Heading: 64px/65.28px, weight 740, tracking -3.52px, `#001c2a`.
- Controls: 44–46px circles with translucent navy background; white arrows.
- Thumbnail rail: 88x64 desktop, 1px cyan active border; gap about 10px.
- Caption: white title 30–34px, small uppercase context label, dark bottom gradient.

## Assets
- Use `siteConfig.images.gallery`; preserve all seven optimized local images and their alt text.

## Responsive
- Mobile large frame is portrait-friendly, about 350x420; thumbnails horizontally scroll; heading 33.6px.
- Modal retains 46px controls and fits within viewport.

