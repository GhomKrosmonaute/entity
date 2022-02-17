export function map(
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds = false
) {
  const output = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  if (!withinBounds) {
    return output
  }
  if (start2 < stop2) {
    return constrain(output, start2, stop2)
  } else {
    return constrain(output, stop2, start2)
  }
}

export function constrain(n: number, low: number, high: number) {
  return Math.max(Math.min(n, high), low)
}
