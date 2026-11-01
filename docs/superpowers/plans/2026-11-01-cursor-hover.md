# Cursor Follower and Navigation Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the custom cursor follower to 36px and add a navigation-pill hover mode that hides the follower and highlights the hovered link.

**Architecture:** Keep the existing cursor CSS and pointer-tracking script in `index.html`. Add a class to the follower while the pointer is inside `.nav-island`, and rely on CSS to hide the follower in that state; strengthen the existing navigation-link hover styling with a subtle red tint and brighter text.

**Tech Stack:** HTML, CSS, vanilla JavaScript.

**Spec:** `docs/superpowers/specs/2026-11-01-cursor-hover-design.md`

## Global Constraints
- Modify only `index.html`.
- Preserve the existing fine-pointer gating, reduced-motion behavior, and touch-device hiding.
- Keep all navigation labels, destinations, and layout unchanged.

## Review Focus
- Pointer enters nav pill gaps or trigger: follower should remain hidden across the whole pill.
- Pointer leaves nav pill: follower should reappear at its current pointer position without a jump.
- Pointer moves between links: only the hovered link receives the red highlight.
- Touch/coarse pointer: custom follower remains disabled.
- Reduced-motion preference: do not add new continuous animation loops.

---

### Task 1: Refine cursor follower and navigation hover behavior

**Files:**
- Modify: `index.html` (cursor CSS, navigation link hover CSS, and existing cursor pointer script)

**Interfaces:**
- Consumes: existing `#siteCursorFollower` element and `.nav-island` navigation container.
- Produces: cursor follower set to 36px; follower hidden while pointer is inside `.nav-island`; active navigation link highlighted by existing `:hover` styling.

- [ ] **Step 1: Update the follower size**
  - Change the follower's CSS fallback dimensions and `data-size` value from 80px to 36px.
  - Confirm the script reads the same `data-size` value so runtime dimensions and margins stay centered.

- [ ] **Step 2: Add navigation hover styling**
  - Update `.navbar .island-menu a:hover` to use a slightly stronger but restrained red translucent background and brighter text.
  - Keep the existing transition and lift effect.

- [ ] **Step 3: Hide the follower over the complete navigation pill**
  - In the existing pointer tracking script, detect whether `event.target` is inside `.nav-island`.
  - Toggle a dedicated state class on the follower for that condition.
  - Add CSS that sets follower opacity to zero in that state.
  - When pointer leaves the pill, restore opacity only if the pointer is still within the document.

- [ ] **Step 4: Verify source behavior**
  - Confirm the data-size, CSS dimensions, and runtime sizing all resolve to 36px.
  - Confirm the nav hover CSS targets individual anchors.
  - Confirm the follower hide condition targets the entire `.nav-island`, including its trigger and gaps.
  - Confirm the existing coarse-pointer media query and pointer-fine JavaScript guard remain unchanged.

- [ ] **Step 5: Commit the focused change**
  - Commit only `index.html` with message `Refine cursor follower and navigation hover`.
