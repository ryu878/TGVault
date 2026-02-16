/**
 * Clipboard utilities - copy and optional clear-after-delay
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function clearClipboardAfterDelay(ms: number): void {
  setTimeout(async () => {
    try {
      await navigator.clipboard.writeText("");
    } catch {
      // Ignore
    }
  }, ms);
}
