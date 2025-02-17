import { describe, it, expect } from "vitest";
import { calculateArea } from "./planeAttributes";

describe("planeAttributes", () => {
  it("should calculate the area of a triangle", () => {
    const a = 3;
    const b = 4;
    const c = 5;
    expect(calculateArea(a, b, c)).toBeCloseTo(6, 3);
  });
});
