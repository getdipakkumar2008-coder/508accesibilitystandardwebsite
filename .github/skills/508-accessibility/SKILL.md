---
name: 508-accessibility
description: >-
  Apply Section 508 and WCAG 2.1 AA accessibility standards when designing,
  implementing, or reviewing web UI, components, forms, media, and documents.
  Use this skill whenever building or auditing HTML/CSS/JS/framework components,
  writing content, or checking pull requests for accessibility conformance.
version: 1.0.0
license: Internal
---

# Section 508 / WCAG 2.1 AA Accessibility Skill

Use this skill to produce and review interfaces that conform to **Section 508
(29 U.S.C. § 794d)** and **WCAG 2.1 Level AA**. Prefer native semantics, verify
with keyboard and screen reader, and never rely on color alone.

## When to use

- Designing or building any UI component, page, form, or navigation.
- Writing or reviewing HTML/CSS/JS or framework markup (React/Angular/Vue/etc.).
- Authoring content, media, or downloadable documents (PDF/Office).
- Reviewing a pull request for accessibility conformance.

## Core principle

> **No ARIA is better than bad ARIA.** Reach for a native HTML element first;
> only add ARIA when no native element expresses the required semantics.

## POUR quick rules

### Perceivable
- Every informative image has meaningful `alt`; decorative images use `alt=""`.
- Video has synchronized **captions**; audio has a **transcript**.
- Use semantic structure: one `<h1>`, no skipped heading levels, real lists, real landmarks.
- Text contrast ≥ **4.5:1**; large text (≥ 24px, or 19px bold) and UI/graphics ≥ **3:1**.
- Never use color as the only means of conveying information or state.
- Do not use tables for layout; data tables use `<th>`, `scope`, and `<caption>`.

### Operable
- All functionality works with the **keyboard alone**; no keyboard traps.
- Focus order is logical and matches visual order; focus is always **visible**.
- Provide a **skip-to-main-content** link as the first focusable element.
- No content flashes more than **3 times per second**.
- No auto-refresh, timeout, or moving content without user control.
- Links have descriptive text (never "click here" / "read more" alone).

### Understandable
- Set the page language (`<html lang>`); use plain language.
- No unexpected context change on focus or input.
- Forms: programmatic labels, clear instructions, accessible error identification and suggestions.
- Layout, navigation, and component behavior are consistent across pages.

### Robust
- Correct **name, role, value** for every interactive element (test with NVDA/VoiceOver).
- Markup passes W3C validation; no duplicate IDs.
- Dynamic updates use ARIA **live regions** (`aria-live`, `role="status"/"alert"`) and do not steal focus.

## Component checklists

### Buttons vs. links
- Use `<button>` for actions, `<a href>` for navigation. Do not swap roles.
- Icon-only controls need an accessible name (`aria-label` or visually-hidden text).

### Forms
- Every field: associated `<label for>` (or `aria-label`/`aria-labelledby`).
- Group related fields with `<fieldset>` + `<legend>` (radios, checkboxes).
- Required: text indicator + `aria-required="true"`; do not rely on color.
- Errors: `aria-invalid="true"`, message linked via `aria-describedby`, focus moved to an error summary.
- CAPTCHA: provide a non-visual alternative (e.g., logic question).

### Modals / dialogs
- Use `role="dialog"` + `aria-modal="true"` with `aria-labelledby`.
- Move focus into the dialog on open; **trap focus** within it; restore focus to the trigger on close.
- `Esc` closes; background is inert to keyboard/SR.

### Menus / navigation
- Prefer `<nav>` + lists of links for site navigation.
- Use the APG disclosure/menu pattern only where a true menu widget is required.
- Arrow-key support for composite widgets (tabs, menubars, comboboxes).

### Accordions / tabs / comboboxes
- Follow the **WAI-ARIA Authoring Practices (APG)** pattern exactly, including keyboard interaction and `aria-expanded`/`aria-selected`/`aria-controls`.

### Media players
- Keyboard-operable controls; visible focus; captions toggle; no autoplay with sound.

### Images & media
- Informative: concise `alt` describing purpose. Complex: provide a long description.
- Decorative: `alt=""` (or CSS background) so SRs skip it.

### Documents (PDF/Office)
- Tagged structure, correct reading order, heading styles, table headers, alt text, document language and title.

## Review workflow

Run this sequence for any change before approving:

1. **Automated:** run `axe`, `Pa11y`, and Lighthouse; resolve all critical/serious issues.
2. **Keyboard:** Tab/Shift+Tab through the page — reach everything, visible focus, no traps, logical order.
3. **Screen reader:** verify names/roles/values and announcements with NVDA or VoiceOver.
4. **Visual:** check contrast, 400% zoom/reflow, and reduced-motion behavior.
5. **Content:** confirm alt text, captions/transcripts, heading order, and link text quality.
6. **Validate:** W3C markup validation with no new errors.

## Definition of Done (accessibility gate)

- [ ] Semantic HTML, correct landmarks, single logical heading order.
- [ ] Fully keyboard operable; visible focus; no traps.
- [ ] Name/role/value correct; verified with a screen reader.
- [ ] Contrast ≥ 4.5:1 (text) / 3:1 (large text & UI); no color-only meaning.
- [ ] Forms labeled, with accessible errors and text-based required indicators.
- [ ] Media captioned/transcribed; images have appropriate alt.
- [ ] Reflows at 400% zoom; respects reduced motion.
- [ ] Automated a11y suite green; no new W3C validation errors.

## Common mistakes to avoid

- Using `<div>`/`<span>` with click handlers instead of `<button>`.
- Placeholder text used as the only label.
- Removing focus outlines (`outline: none`) without a visible replacement.
- `aria-label` on non-interactive/generic elements where it is ignored.
- Positive `tabindex` values (breaks natural order).
- Announcing dynamic content by moving focus instead of a live region.
- Conveying required/error/status by color alone.

## References

- Section 508 — 29 U.S.C. § 794d and the ICT Refresh.
- WCAG 2.1 Level AA success criteria.
- WAI-ARIA Authoring Practices (APG) patterns.
- OWASP Top 10 (pair accessibility with secure input handling).
