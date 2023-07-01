export function dateShiftHours(d: Date, h: number) {
  return new Date(d.getTime() + 1000 * 60 * 60 * h);
}