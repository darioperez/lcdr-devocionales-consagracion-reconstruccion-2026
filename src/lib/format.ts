export function formatDateEs(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const s = new Intl.DateTimeFormat("es-ES", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function weekdayEs(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const s = new Intl.DateTimeFormat("es-ES", {
    timeZone: "UTC",
    weekday: "long",
  }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
