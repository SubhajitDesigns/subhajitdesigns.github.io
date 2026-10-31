# AI Development Guide — Subhajit Portfolio

This repository is Subhajit's personal portfolio website, published with GitHub Pages. Treat the existing project as a production website, not a disposable starter.

## Project context
- The site is a static, browser-native website built primarily with HTML, CSS, and JavaScript.
- The current implementation includes a large `index.html` with embedded styles and scripts, plus supporting assets and JavaScript files such as `modelData.js`. The README may not always reflect the latest file structure.
- The visual direction is dark, cinematic, premium, and editorial, with black/deep-red accents, expressive typography, polished motion, and interactive details.
- Existing technologies in the site include Three.js and GSAP/ScrollTrigger. Reuse the existing stack and versions unless a change is necessary and explained.
- GitHub Pages is the publishing target. Do not assume a Node build pipeline or package manager exists.

## Mandatory workflow before every change
1. Inspect the current default branch, relevant files, dependencies, assets, and nearby code before editing.
2. Identify the smallest set of files that can safely implement the requested change.
3. Explain the intended change briefly when it is substantial or risky. Ask before destructive, broad, or irreversible changes.
4. Preserve existing sections, copy, assets, animations, interactions, responsive behavior, and accessibility unless Subhajit explicitly asks to change them.
5. Make focused edits. Do not replace the whole page, reformat unrelated code, remove features, rename files, or introduce a framework/build system just for convenience.
6. Check the final diff for accidental deletions, duplicate handlers/styles, broken selectors, and unrelated changes.
7. Report exactly which files changed, what changed, what checks were run, and any remaining limitations.

## Frontend implementation standards
- Keep HTML semantic and accessible; use meaningful labels, keyboard focus states, and appropriate ARIA only where needed.
- Write maintainable CSS and JavaScript consistent with the repository's existing conventions.
- Make every change responsive across desktop, tablet, and mobile; check narrow widths and prevent horizontal overflow or clipped text.
- Respect `prefers-reduced-motion`, touch input, and devices without hover. Avoid unnecessary continuous animation loops and clean up event listeners/observers/animation instances when applicable.
- For GSAP, ScrollTrigger, and Three.js, verify initialization order, element existence, resize handling, and teardown/cleanup where relevant. Avoid loading duplicate libraries.
- Preserve performance: optimize large media, avoid layout thrashing, and use lazy loading where appropriate without breaking above-the-fold content.
- Keep SEO basics, metadata, page titles, and social previews intact when editing the document head.
- Never invent client testimonials, credentials, metrics, or contact details. Preserve supplied factual content.

## Debugging and verification
- Trace the actual cause before applying a fix; do not hide errors with broad try/catch blocks or arbitrary CSS overrides.
- Check browser console errors, failed asset paths, missing IDs/classes, and runtime assumptions when browser inspection is available.
- For static-site changes, validate HTML/CSS/JS syntax with available tools and inspect the rendered page at desktop and mobile sizes when possible.
- If a test cannot be run in this environment, say so clearly rather than claiming it passed.

## Git and release safety
- Prefer a focused feature/fix branch and pull request for multi-file or risky work. For tiny, explicitly requested edits, a direct commit may be appropriate.
- Use descriptive commit messages. Never force-push, rewrite history, delete branches, or overwrite unrelated work without explicit permission.
- Never commit secrets, API keys, private credentials, personal data, or generated bulky artifacts.
- Do not merge or deploy unless Subhajit asks or the requested workflow clearly authorizes it.
- After changes, summarize the commit/branch/PR and provide the relevant GitHub link when available.

## Communication
- Subhajit prefers direct implementation over snippets that require manual copying.
- Keep explanations clear and practical. Do not ask him to repeat repository details already established.
- If a request is ambiguous, ask one focused question before making a potentially wrong change.
