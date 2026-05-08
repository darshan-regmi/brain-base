/**
 * SM-2 (SuperMemo 2) spaced repetition.
 * quality: 0 = blackout, 5 = perfect.
 * Maps to UX buttons: Again=1, Hard=2, Good=3, Easy=5.
 */

export interface SM2Card {
  ease: number; // EF in SM-2
  interval: number; // days
  repetitions: number;
}

export function review(card: SM2Card, quality: number): SM2Card {
  const q = Math.max(0, Math.min(5, quality));

  let { ease, interval, repetitions } = card;

  // Update ease factor (clamped to 1.3)
  ease = Math.max(1.3, ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  if (q < 3) {
    // Failure — reset
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ease);
    repetitions += 1;
  }

  return { ease, interval, repetitions };
}

export const QUALITY_AGAIN = 1;
export const QUALITY_HARD = 2;
export const QUALITY_GOOD = 3;
export const QUALITY_EASY = 5;
