# Refine Cursor Follower and Navigation Hover Design

## Intent
Make the existing custom cursor follower smaller and improve the navigation pill interaction to feel closer to the supplied Moncy.dev reference.

## Goals
- Reduce the follower diameter from 80px to 36px.
- Preserve smooth pointer-follow movement and the existing reduced-motion/touch-device safeguards.
- Hide the follower while the pointer is inside the complete navigation pill.
- Highlight the individual navigation link under the pointer with a subtle red background and brighter text.

## Non-goals
- Do not redesign the navigation layout or change its labels/links.
- Do not change cursor behavior elsewhere beyond the requested smaller size.
- Do not alter mobile/touch behavior or unrelated sections.

## Approaches
- A: Hide the follower only over individual navigation links. This leaves it visible in gaps and around the pill.
- B: Hide it over the whole navigation pill and style the hovered link individually. Selected because it matches the requested reference behavior more completely.

## Constraints
- Modify only `index.html`.
- Reuse the existing `.site-cursor-follower`, `#siteCursorFollower`, and `.navbar .island-menu a` implementation.
- Keep the current pointer-fine gating and touch-device hiding behavior.
