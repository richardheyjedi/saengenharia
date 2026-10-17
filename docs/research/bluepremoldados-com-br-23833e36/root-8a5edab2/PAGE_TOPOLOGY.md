# Page Topology

1. Fixed header over hero; transparent at top, solid navy after 30px scroll; mobile full-screen menu.
2. Hero: full-viewport owned project image, navy overlay, oversized white/cyan statement, supporting copy, location facts, two CTAs.
3. Services: white background, large split heading, bordered service cards with index and lightweight icons.
4. Gallery: soft-gray section, large active project image with overlay caption, arrows, and thumbnail rail; click opens lightbox.
5. Management/benefits: deep-navy band with oversized white heading and horizontally divided benefit items.
6. Audiences: white card matrix retaining S.A Engenharia audience content.
7. About: split image/copy layout with white background and large highlighted phrase.
8. Regions and FAQ: compact supporting sections using the same card and accordion language.
9. Contact: white split layout with oversized heading on the left and navy form panel with yellow submit action on the right.
10. Footer: very dark navy, three-column information layout and subdued bottom row.

Interaction models:

- Header: scroll-driven class change at 30px and click-driven mobile menu.
- Reveal effects: scroll-driven IntersectionObserver already present in the app.
- Gallery: click-driven next/previous/thumbnails/lightbox; keyboard arrows and Escape.
- FAQ: native click-driven `details` elements.
- Contact: form validation and WhatsApp handoff retained.

