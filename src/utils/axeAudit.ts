/**
 * WCAG 2.1 AA -auditointi axe-corella.
 * Suoritetaan vain kehitysympäristössä (import.meta.env.DEV).
 * Lataa axe-core CDN:stä, jotta npm-asennusta ei tarvita.
 */

const WCAG_21_AA_TAGS = ["wcag21aa"] as const;
const AXE_CDN_URL = "https://unpkg.com/axe-core@4.10.2/axe.min.js";

declare global {
  interface Window {
    axe?: {
      run: (
        context: Document | Element,
        options: { runOnly: { type: "tag"; values: string[] } },
        callback: (err: Error | null, results: AxeResults) => void,
      ) => void;
    };
  }
}

export type AxeViolation = {
  id: string;
  impact?: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{ html: string; target: string[]; failureSummary?: string }>;
};

export type AxeResults = {
  violations: AxeViolation[];
  passes: unknown[];
  incomplete: unknown[];
  inapplicable: unknown[];
};

function reportViolations(results: AxeResults): void {
  if (results.violations.length === 0) {
    console.log(
      "%c[WCAG 2.1 AA] ✓ Ei havaintoja",
      "color: green; font-weight: bold",
    );
    return;
  }

  console.groupCollapsed(
    `%c[WCAG 2.1 AA] ⚠ ${results.violations.length} havaintoa`,
    "color: orange; font-weight: bold",
  );

  results.violations.forEach((v, i) => {
    console.group(
      `%c${i + 1}. ${v.help} (${v.impact ?? "?"})`,
      "color: #e67e22",
    );
    console.log("Kuvaus:", v.description);
    console.log("Ohje:", v.helpUrl);
    v.nodes.forEach((node, j) => {
      console.log(`Kohde ${j + 1}:`, node.html);
      console.log("Selector:", node.target);
      if (node.failureSummary) console.log("Yhteenveto:", node.failureSummary);
    });
    console.groupEnd();
  });

  console.groupEnd();
}

function loadAxeScript(): Promise<typeof window.axe> {
  if (typeof window === "undefined") return Promise.resolve(undefined);
  if (window.axe) return Promise.resolve(window.axe);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = AXE_CDN_URL;
    script.async = true;
    script.onload = () => resolve(window.axe);
    script.onerror = () => reject(new Error("axe-core script failed to load"));
    document.head.appendChild(script);
  });
}

/**
 * Suorittaa WCAG 2.1 AA -auditoinnin annetulla kontekstilla (oletuksena document).
 * Käytä vain dev-tilassa.
 */
export async function runAxeAudit(
  context?: Document | Element,
): Promise<AxeResults | null> {
  if (!import.meta.env.DEV) return null;

  try {
    const axe = await loadAxeScript();
    if (!axe) {
      console.warn("[WCAG 2.1 AA] axe-core ei ladannut.");
      return null;
    }

    return new Promise((resolve, reject) => {
      axe.run(context ?? document, {
        runOnly: {
          type: "tag",
          values: [...WCAG_21_AA_TAGS],
        },
      }, (err: Error | null, results: AxeResults) => {
        if (err) {
          reject(err);
          return;
        }
        reportViolations(results);
        resolve(results);
      });
    });
  } catch (e) {
    console.warn("[WCAG 2.1 AA] axe-core -audointi ei käynnistynyt:", e);
    return null;
  }
}
