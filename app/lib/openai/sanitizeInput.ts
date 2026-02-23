/**
 * Sanitize user-provided text before including it in AI prompts.
 * Strips control characters and truncates to a safe length.
 */

const MAX_TITLE_LENGTH = 200;
const MAX_NOTES_LENGTH = 1000;
const MAX_TEXT_LENGTH = 5000;

// Strip control characters (except newlines and tabs in notes/text)
function stripControlChars(str: string, allowNewlines: boolean): string {
  if (allowNewlines) {
    return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  }
  return str.replace(/[\x00-\x1F\x7F]/g, "");
}

export function sanitizeTitle(title: string): string {
  return stripControlChars(title, false).trim().slice(0, MAX_TITLE_LENGTH);
}

export function sanitizeNotes(notes: string): string {
  return stripControlChars(notes, true).trim().slice(0, MAX_NOTES_LENGTH);
}

export function sanitizeText(text: string): string {
  return stripControlChars(text, true).trim().slice(0, MAX_TEXT_LENGTH);
}
