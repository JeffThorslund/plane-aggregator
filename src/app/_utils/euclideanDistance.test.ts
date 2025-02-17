import { describe, expect, it } from "vitest";
import { euclideanDistance } from "./euclideanDistance";
import { Point } from "./types";

describe("euclideanDistance", () => {
  it("should return 0 for the same point", () => {
    const point: Point = { x: 1, y: 2, z: 3 };
    expect(euclideanDistance(point, point)).toBe(0);
  });

  it("should calculate the distance between two points", () => {
    const pointA: Point = { x: 1, y: 2, z: 3 };
    const pointB: Point = { x: 4, y: 6, z: 8 };
    expect(euclideanDistance(pointA, pointB)).toBeCloseTo(7.071, 3);
  });

  it("should handle negative coordinates", () => {
    const pointA: Point = { x: -1, y: -2, z: -3 };
    const pointB: Point = { x: -4, y: -6, z: -8 };
    expect(euclideanDistance(pointA, pointB)).toBeCloseTo(7.071, 3);
  });
});
