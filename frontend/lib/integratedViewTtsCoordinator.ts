/** Ensures only one Integrated View TTS session runs; previous session cleanup runs when a new one starts. */

let activeCleanup: (() => void) | null = null;

export function replaceIntegratedViewTtsSession(newCleanup: () => void): void {
  activeCleanup?.();
  activeCleanup = newCleanup;
}

export function endIntegratedViewTtsSession(cleanup: () => void): void {
  if (activeCleanup === cleanup) {
    activeCleanup = null;
  }
}
