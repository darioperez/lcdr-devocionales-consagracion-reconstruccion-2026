export function formatDateEs(dateStr: string, timeZone: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const s = new Intl.DateTimeFormat("es-ES", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function weekdayEs(dateStr: string, timeZone: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const s = new Intl.DateTimeFormat("es-ES", {
    timeZone,
    weekday: "long",
  }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
