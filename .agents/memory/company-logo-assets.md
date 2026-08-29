---
name: Company logo assets
description: The homepage marquee's logo strategy and its network dependency constraint.
---

Homepage company logos should use inline SVG assets rather than a third-party logo CDN.

**Why:** External logo requests were blocked in the Replit preview environment, creating failed resource errors and unreliable rendering.

**How to apply:** When adding or changing the company marquee, keep the logos bundled in the component or in local public assets; do not reintroduce CDN-hosted logo images.