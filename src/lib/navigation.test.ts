import { describe, expect, it } from "vitest";
import { getNavDirection } from "./navigation";

describe("getNavDirection", () => {
  it("pushes forward from home to the plan list", () => {
    expect(getNavDirection("/", "/dias")).toBe("next");
  });

  it("pushes forward from home to a day", () => {
    expect(getNavDirection("/", "/dias/1")).toBe("next");
  });

  it("pushes forward from the list into a day", () => {
    expect(getNavDirection("/dias", "/dias/3")).toBe("next");
  });

  it("goes back from a day to the list", () => {
    expect(getNavDirection("/dias/3", "/dias")).toBe("back");
  });

  it("goes back from a day to home", () => {
    expect(getNavDirection("/dias/3", "/")).toBe("back");
  });

  it("pushes forward to a later day", () => {
    expect(getNavDirection("/dias/2", "/dias/4")).toBe("next");
  });

  it("goes back to an earlier day", () => {
    expect(getNavDirection("/dias/4", "/dias/2")).toBe("back");
  });

  it("treats same-page navigation as forward", () => {
    expect(getNavDirection("/dias/3", "/dias/3")).toBe("next");
  });

  it("ignores trailing slashes", () => {
    expect(getNavDirection("/dias/", "/")).toBe("back");
  });
});
