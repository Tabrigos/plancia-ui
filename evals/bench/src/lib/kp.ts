export type KpReading = { time: string; value: number }

/** The NOAA planetary K index rows, newest last; the last one or undefined. */
export function latestKp(readings: KpReading[]): KpReading | undefined {
  return readings.at(-1)
}

/** Rows of the NOAA JSON product: a header row, then [time, kp, ...]. */
export function parseKp(rows: unknown[][]): KpReading[] {
  return rows.slice(1).map(([time, value]) => ({ time: String(time), value: Number(value) }))
}
