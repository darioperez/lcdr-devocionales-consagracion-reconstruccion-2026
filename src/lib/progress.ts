const STORAGE_KEY = "progreso";

export function getCompletedDays(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

export function isDayCompleted(dia: number): boolean {
  return getCompletedDays().includes(dia);
}

export function toggleDay(dia: number): boolean {
  const current = getCompletedDays();
  const next = current.includes(dia)
    ? current.filter((d) => d !== dia)
    : [...current, dia];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // almacenamiento no disponible (modo incógnito estricto)
  }
  return next.includes(dia);
}

export function completedCount(): number {
  return getCompletedDays().length;
}
