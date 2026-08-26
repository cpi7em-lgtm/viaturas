import { describe, expect, test } from "vitest";
import { cronJobs } from "./cron.js";
import { makeFunctionReference } from "./api.js";

const fn = makeFunctionReference<"mutation">("crons:job");

function exported(build: (crons: ReturnType<typeof cronJobs>) => void) {
  const crons = cronJobs();
  build(crons);
  return JSON.parse(crons.export());
}

describe("cron schedules with an optional minute", () => {
  test("hourly with an explicit minute keeps it", () => {
    const crons = exported((c) => c.hourly("a", { minuteUTC: 5 }, fn));
    expect(crons.a.schedule).toEqual({ type: "hourly", minuteUTC: 5 });
  });

  test("hourly with an empty schedule omits the minute", () => {
    const crons = exported((c) => c.hourly("a", {}, fn));
    expect(crons.a.schedule).toEqual({ type: "hourly" });
  });

  test("hourly with no schedule at all omits the minute", () => {
    const crons = exported((c) => c.hourly("a", fn));
    expect(crons.a.schedule).toEqual({ type: "hourly" });
  });

  test("daily/weekly/monthly omit the minute when it isn't given", () => {
    const crons = exported((c) => {
      c.daily("d", { hourUTC: 3 }, fn);
      c.weekly("w", { dayOfWeek: "monday", hourUTC: 3 }, fn);
      c.monthly("m", { day: 1, hourUTC: 3 }, fn);
    });
    expect(crons.d.schedule).toEqual({ type: "daily", hourUTC: 3 });
    expect(crons.w.schedule).toEqual({
      type: "weekly",
      dayOfWeek: "monday",
      hourUTC: 3,
    });
    expect(crons.m.schedule).toEqual({ type: "monthly", day: 1, hourUTC: 3 });
  });

  test("daily keeps an explicit minute", () => {
    const crons = exported((c) =>
      c.daily("d", { hourUTC: 3, minuteUTC: 23 }, fn),
    );
    expect(crons.d.schedule).toEqual({
      type: "daily",
      hourUTC: 3,
      minuteUTC: 23,
    });
  });

  test("an out-of-range minute is still rejected", () => {
    expect(() => cronJobs().hourly("a", { minuteUTC: 60 }, fn)).toThrow();
  });
});
