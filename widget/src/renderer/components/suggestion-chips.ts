import { createLogger } from "../logger";

const logger = createLogger("SuggestionChips");

const CHIPS = [
  "What's next?",
  "Add a task",
  "How's my day?",
];

export function buildSuggestionChips(): string {
  logger.debug("Built suggestion chips");

  const chipButtons = CHIPS.map(
    (text) =>
      `<button class="chip" data-chip-text="${text}">${text}</button>`
  ).join("");

  return `
    <div class="chips-container">
      ${chipButtons}
    </div>
  `;
}
