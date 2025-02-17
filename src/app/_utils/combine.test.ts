import { describe, test, expect } from "vitest";
import { combine } from "./combine";

describe("combine", () => {
  test("should combine numbers", () => {
    const arr = [0, 1, 2, 3];

    expect(combine(arr, 2)).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
  });

  test("should combine numbers with k = 3", () => {
    const arr = [1, 8, 3, 4];

    expect(combine(arr, 2)).toEqual([
      [1, 8],
      [1, 3],
      [1, 4],
      [8, 3],
      [8, 4],
      [3, 4],
    ]);
  });
});
