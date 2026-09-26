import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** A time-series data row: dynamic column keys with scalar values. */
export type DataRow = Record<string, string | number>;
