import { euclideanDistance } from "./euclideanDistance";
import { Plane } from "./types";

export function getPlaneAttributes(plane: Plane) {
  const [p1, p2, p3] = plane;

  const a = euclideanDistance(p1, p2);
  const b = euclideanDistance(p2, p3);
  const c = euclideanDistance(p3, p1);

  return {
    area: calculateArea(a, b, c),
  };
}

export function calculateArea(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}
