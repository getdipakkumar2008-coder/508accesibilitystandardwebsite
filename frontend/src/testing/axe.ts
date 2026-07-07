import axe, { type ElementContext, type RunOptions, type AxeResults } from 'axe-core';

/**
 * Default axe options for unit tests.
 * `color-contrast` is disabled because jsdom has no layout engine and cannot
 * compute rendered colors; contrast is verified in the browser-based E2E suite.
 */
const defaultOptions: RunOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
};

/**
 * Runs axe-core against a DOM element and throws with a readable summary if any
 * WCAG / Section 508 violations are detected. Use in Vitest specs to enforce the
 * accessibility quality gate at the component level.
 */
export async function expectNoA11yViolations(
  element: ElementContext,
  options: RunOptions = defaultOptions,
): Promise<void> {
  const results: AxeResults = await axe.run(element, options);

  if (results.violations.length > 0) {
    const summary = results.violations
      .map(
        (v) =>
          `- [${v.impact ?? 'n/a'}] ${v.id}: ${v.help}\n    ${v.nodes
            .map((n) => n.target.join(' '))
            .join('\n    ')}`,
      )
      .join('\n');
    throw new Error(
      `Expected no accessibility violations but found ${results.violations.length}:\n${summary}`,
    );
  }
}
