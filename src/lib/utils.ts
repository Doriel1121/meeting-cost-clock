export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function formatCurrency(amount: number | string): string {
  return `$${Number(amount).toFixed(2)}`;
}