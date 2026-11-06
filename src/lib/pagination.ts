export function pageNumber(value: string | undefined): number | null {
  if (value === undefined) return 1;
  if (!/^[1-9]\d*$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) ? n : null;
}
