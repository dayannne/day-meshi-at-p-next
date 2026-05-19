import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 徒歩の所要時間（秒）を分単位の数値に変換する。
 * - 60秒以下は一律 1 とする。
 * - それ以上は四捨五入して分単位にする。
 * - null/undefined の場合は null を返す。
 */
export function getWalkingDurationMinutes(
  durationSeconds: number | null | undefined
): number | null {
  if (durationSeconds == null) {
    return null;
  }

  if (durationSeconds <= 60) {
    return 1;
  }

  return Math.round(durationSeconds / 60);
}
