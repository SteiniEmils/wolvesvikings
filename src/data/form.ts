export type FormResult = "W" | "D" | "L"

/**
 * Most recent first. The free score feed only returns one past match,
 * so keep the rest of the five here and update after each game.
 */
export const formHistory: Record<"wolves" | "stourbridge", FormResult[]> = {
  wolves: ["W", "W", "D", "L", "W"],
  stourbridge: ["L", "D", "D", "W", "D"],
}
