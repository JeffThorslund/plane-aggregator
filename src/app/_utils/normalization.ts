import { TFaultIntercept } from "./types";

export function normalizeFields(points: TFaultIntercept[]) {
  const x = points.map((point) => point.x);
  const xMin = Math.min(...x);
  const xMax = Math.max(...x);

  const y = points.map((point) => point.y);
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);

  const z = points.map((point) => point.z);
  const zMin = Math.min(...z);
  const zMax = Math.max(...z);

  return points.map((point) => ({
    ...point,
    x: normalizeMinMax(point.x, xMin, xMax),
    y: normalizeMinMax(point.y, yMin, yMax),
    z: normalizeMinMax(point.z, zMin, zMax),
  }));
}

export function normalizeMinMax(point: number, min: number, max: number) {
  if (min === max) {
    return 0.5;
  }

  return (point - min) / (max - min);
}
