import { useEffect } from "react";

interface Shortcut {
  /** Key to match (case-insensitive), e.g. "n", "b", "Escape" */
  key: string;
  /** Require Cmd (Mac) / Ctrl (Windows/Linux). Default false. */
  meta?: boolean;
  /** Handler to call when shortcut fires. */
  handler: () => void;
}

/**
 * Registers global keyboard shortcuts.
 * Skips meta-key combos when focused in an input/textarea (except Escape).
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const metaMatch = shortcut.meta ? e.metaKey || e.ctrlKey : true;

        if (!keyMatch || !metaMatch) continue;

        // Skip all shortcuts when typing in inputs (Escape always works)
        if (inInput && shortcut.key !== "Escape") continue;

        e.preventDefault();
        shortcut.handler();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts]);
}
