import { describe, expect, it } from "vitest";
import {
  currentDayNumber,
  dateOfDay,
  dayStatus,
  planPhase,
  todayInTimeZone,
} from "./plans";
import type { Plan } from "./plans";

const plan = {
  config: {
    titulo: "Test",
    subtitulo: "",
    descripcion: "",
    inicio: "2026-09-28",
    fin: "2026-10-02",
    timezone: "America/Caracas",
    cierre: { titulo: "", detalle: "" },
    iglesia: { nombre: "", linea: "" },
  },
  dias: [1, 2, 3, 4, 5].map((n) => ({
    n,
    titulo: `Día ${n}`,
    pasaje: "Test",
    contenido: "",
  })),
} as Plan;

describe("todayInTimeZone", () => {
  it("formats a UTC instant as a date in America/Caracas", () => {
    // 2026-09-28 03:30 UTC = 2026-09-27 23:30 in Caracas (UTC-4)
    const now = new Date("2026-09-28T03:30:00Z");
    expect(todayInTimeZone("America/Caracas", now)).toBe("2026-09-27");
  });

  it("rolls over at midnight Caracas", () => {
    // 2026-09-28 04:00 UTC = 2026-09-28 00:00 in Caracas
    const now = new Date("2026-09-28T04:00:00Z");
    expect(todayInTimeZone("America/Caracas", now)).toBe("2026-09-28");
  });
});

describe("planPhase", () => {
  it("is before when today precedes the start", () => {
    expect(planPhase("2026-09-28", "2026-10-02", "2026-09-27")).toBe("before");
  });

  it("is during on the first day", () => {
    expect(planPhase("2026-09-28", "2026-10-02", "2026-09-28")).toBe("during");
  });

  it("is during on the last day", () => {
    expect(planPhase("2026-09-28", "2026-10-02", "2026-10-02")).toBe("during");
  });

  it("is after when today follows the end", () => {
    expect(planPhase("2026-09-28", "2026-10-02", "2026-10-03")).toBe("after");
  });
});

describe("dayStatus", () => {
  it("locks days before their date", () => {
    expect(dayStatus("2026-09-29", "2026-09-28")).toBe("locked");
  });

  it("opens a day on its date", () => {
    expect(dayStatus("2026-09-29", "2026-09-29")).toBe("open");
  });

  it("keeps past days open", () => {
    expect(dayStatus("2026-09-29", "2026-10-01")).toBe("open");
  });
});

describe("dateOfDay", () => {
  it("maps day 1 to the plan start", () => {
    expect(dateOfDay(plan, 1)).toBe("2026-09-28");
  });

  it("maps day 5 to the plan end", () => {
    expect(dateOfDay(plan, 5)).toBe("2026-10-02");
  });

  it("crosses month boundaries", () => {
    expect(dateOfDay(plan, 4)).toBe("2026-10-01");
  });
});

describe("currentDayNumber", () => {
  it("is null before the plan starts", () => {
    expect(currentDayNumber(plan, "2026-09-27")).toBeNull();
  });

  it("is null after the plan ends", () => {
    expect(currentDayNumber(plan, "2026-10-03")).toBeNull();
  });

  it("resolves the day matching today's date", () => {
    expect(currentDayNumber(plan, "2026-09-30")).toBe(3);
  });

  it("is null when a gap exists between dates", () => {
    expect(currentDayNumber(plan, "2026-09-29")).toBe(2);
  });
});
