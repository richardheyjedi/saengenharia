# Behaviors

- Header starts transparent at 92px desktop / 82px mobile and becomes `rgba(0,28,42,.96)` at 72px after 30px scroll. Transition: background, shadow, and height over 350ms; backdrop blur 14px.
- Mobile menu opens from the fixed header, locks body scroll, and exposes full-size navigation. Menu button is 46px circular with a translucent white border.
- Hero buttons rise 2px on hover over 250ms. Primary changes to a stronger fill; secondary changes from a faint translucent surface to a cyan-tinted surface and cyan border.
- Content elements reveal from 26px below with opacity transition as they enter the viewport.
- Gallery uses previous/next controls, clickable thumbnails, image captions, and click-to-expand behavior.
- Service and construction cards use subtle border-color, image-scale, and lift changes on hover.
- Floating WhatsApp action is fixed at the lower-right only when a valid number exists; current S.A configuration keeps it hidden until configured.
- Motion is disabled or minimized under `prefers-reduced-motion: reduce`.

Responsive behavior:

- Desktop uses a 1240px content width and large 64–102px headings.
- Tablet retains two-column hero/contact arrangements until approximately 860px, then stacks.
- Mobile uses 20px side gutters, 33–49px headings, single-column cards, 46px touch targets, and a stacked contact form.

