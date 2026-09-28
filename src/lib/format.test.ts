import { describe, expect, it } from "vitest";
import { formatDateEs, weekdayEs } from "./format";

describe("formatDateEs", () => {
  it("renders the plan start as Monday, not Sunday", () => {
    expect(formatDateEs("2026-09-28")).toBe("Lunes, 28 de septiembre");
  });

  it("renders the plan end as Friday", () => {
    expect(formatDateEs("2026-10-02")).toBe("Viernes, 2 de octubre");
  });

  it("renders a mid-week date", () => {
    expect(formatDateEs("2026-09-30")).toBe("Miércoles, 30 de septiembre");
  });

  it("renders a Sunday without shifting", () => {
    expect(formatDateEs("2026-09-27")).toBe("Domingo, 27 de septiembre");
  });
});

describe("weekdayEs", () => {
  it("returns Lunes for day 1", () => {
    expect(weekdayEs("2026-09-28")).toBe("Lunes");
  });

  it("returns Viernes for day 5", () => {
    expect(weekdayEs("2026-10-02")).toBe("Viernes");
  });

  it("returns Domingo for a Sunday", () => {
    expect(weekdayEs("2026-09-27")).toBe("Domingo");
  });
});
