import { kdTree } from "kd-tree-javascript";
import { euclideanDistance } from "./euclideanDistance";
import { Combination, Index, TFaultIntercept, TFaultPlane } from "./types";
import { combine } from "./combine";

export const buildPlanes = (
  faults: TFaultIntercept[],
  number_of_neighbors: number
) => {
  const referenceCopy = [...faults];
  const tree = new kdTree(referenceCopy, euclideanDistance, ["x", "y", "z"]);

  return faults
    .map((fault, i) => {
      const nearest = tree.nearest(fault, number_of_neighbors);
      return combine(nearest.map((p) => p[0].index))
        .map((combination) => addCurrentIndexToCombination(i, combination))
        .filter((combination) =>
          removeCombinationsWithRepeatingHoleIds(combination, faults)
        )
        .map((combination) => lookupPlaneValues(combination, faults));
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
