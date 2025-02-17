import { describe, it, expect } from "vitest";
import { normalizeFields, normalizeMinMax } from "./normalization";
import { TFaultIntercept } from "./types";

const addFields = (point: { x: number; y: number; z: number }, i: number) => ({
  ...point,
  class: "1",
  index: i,
  hole_id: "1",
});

describe("normalizeFields", () => {
  it("should normalize the fields of points", () => {
    const points: TFaultIntercept[] = [
      { x: 1, y: 2, z: 3 },
      { x: 4, y: 5, z: 6 },
      { x: 7, y: 8, z: 9 },
    ].map(addFields);
    const normalized = normalizeFields(points);
    expect(normalized).toEqual(
      [
        { x: 0, y: 0, z: 0 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 1, y: 1, z: 1 },
      ].map(addFields)
    );
  });

  it("should handle the case where all points have the same value", () => {
    const points: TFaultIntercept[] = [
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: 1, y: 1, z: 1 },
    ].map(addFields);
    const normalized = normalizeFields(points);
    expect(normalized).toEqual(
      [
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
        { x: 0.5, y: 0.5, z: 0.5 },
      ].map(addFields)
    );
  });
});

describe("normalizeMinMax", () => {
  it("should normalize a point within a range", () => {
    expect(normalizeMinMax(5, 0, 10)).toBe(0.5);
  });

  it("should return 0.5 if min and max are the same", () => {
    expect(normalizeMinMax(5, 5, 5)).toBe(0.5);
  });
});
