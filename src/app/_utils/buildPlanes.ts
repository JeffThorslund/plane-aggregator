import { kdTree } from "kd-tree-javascript";
import { euclideanDistance } from "./euclideanDistance";
import {
  Combination,
  Index,
  TFaultIntercept,
  TFaultPlane,
  Vector,
} from "./types";
import { combine } from "./combine";

export const buildPlanes = (faults: TFaultIntercept[]) => {
  const referenceCopy = [...faults];
  const tree = new kdTree(referenceCopy, euclideanDistance, ["x", "y", "z"]);

  return faults
    .map((fault, i) => {
      const nearest = tree.nearest(fault, 100, 0.1);
      return combine(nearest.map((p) => p[0].index))
        .map((combination) => addCurrentIndexToCombination(i, combination))
        .filter((combination) =>
          removeCombinationsWithRepeatingHoleIds(combination, faults)
        )
        .map((combination) => lookupPlaneValues(combination, faults))
        .filter((plane) => {
          const dip = calculateDip(plane);
          return dip > 80 && dip < 90;
        });
    })
    .flat();
};

const addCurrentIndexToCombination = (
  currentIndex: number,
  combination: [Index, Index]
): [Index, Index, Index] => {
  return [currentIndex, ...combination];
};

const removeCombinationsWithRepeatingHoleIds = (
  combination: Combination,
  faults: TFaultIntercept[]
): boolean => {
  return (
    new Set(combination.map((pointIndex) => faults[pointIndex].hole_id))
      .size === combination.length
  );
};

const lookupPlaneValues = (
  combination: Combination,
  faults: TFaultIntercept[]
): TFaultPlane => {
  return [
    faults[combination[0]],
    faults[combination[1]],
    faults[combination[2]],
  ];
};

function calculateDip(plane: TFaultPlane): number {
  const [p1, p2, p3] = plane;
  // Vector calculations

  const v1: Vector = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z,
  };

  const v2: Vector = {
    x: p3.x - p1.x,
    y: p3.y - p1.y,
    z: p3.z - p1.z,
  };

  // Compute normal vector (cross product of v1 and v2)
  const normal: Vector = {
    x: v1.y * v2.z - v1.z * v2.y, // Nx
    y: v1.z * v2.x - v1.x * v2.z, // Ny
    z: v1.x * v2.y - v1.y * v2.x, // Nz
  };

  // Normalize the normal vector
  const normalMagnitude = Math.sqrt(
    normal.x ** 2 + normal.y ** 2 + normal.z ** 2
  );

  const unitNormal: Vector = {
    x: normal.x / normalMagnitude,
    y: normal.y / normalMagnitude,
    z: normal.z / normalMagnitude,
  };
  // Dot product with vertical axis (Z-axis)
  const cosTheta = Math.abs(unitNormal.z); // Ensure positive dip angle

  // Theta is the angle between normal and vertical axis
  const theta = Math.acos(cosTheta); // In radians

  // Dip is measured from horizontal (90° - theta)
  const dip = 90 - (theta * 180) / Math.PI;

  return dip;
}
