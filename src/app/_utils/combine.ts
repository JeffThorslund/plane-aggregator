import { Index } from "./types";

export function combine(arr: Index[]): [Index, Index][] {
  const k = 2;

  const result: [Index, Index][] = [];

  function backtrack(start: number, path: number[]) {
    if (path.length === k) {
      result.push([path[0], path[1]]); // Store the valid combination
      return;
    }

    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]); // Choose
      backtrack(i + 1, path); // Explore
      path.pop(); // Un-choose (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}
