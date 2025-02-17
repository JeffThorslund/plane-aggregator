"use client";

import dynamic from "next/dynamic";
import sample_data from "./sample_data.json";
import RangeSlider, { MinMax } from "./slider";
import { useState } from "react";
import { kdTree } from "kd-tree-javascript";

type TFaultIntercept = {
  x: number;
  y: number;
  z: number;
  class: string;
  index: number;
  hole_id: string;
};

const data = normalizeMinMax(
  sample_data
    .filter((d) => d.class === Number(2) || d.class === Number(3))
    .map((d, i) => ({
      ...d,
      index: i,
    })) as TFaultIntercept[]
);

console.log(data);

type TFaultPlane = {
  area: number;
  dip: number;
  azimuth: number;
  plane: [TFaultIntercept, TFaultIntercept, TFaultIntercept];
};

function getStats(plane: [TFaultIntercept, TFaultIntercept, TFaultIntercept]) {
  const [p1, p2, p3] = plane;

  const a = euclideanDistance(p1, p2);
  const b = euclideanDistance(p2, p3);
  const c = euclideanDistance(p3, p1);

  // area
  const s = (a + b + c) / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

  // dip
  const dip = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));

  // azimuth
  const x = Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c));
  const azimuth = Math.acos(x) * Math.sign(p3.y - p1.y);

  return {
    area,
    dip,
    azimuth,
  };
}

export default function Home() {
  const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

  const [dip, setDip] = useState<MinMax>([0, 90]);

  const [asimuth, setAsimuth] = useState<MinMax>([0, 360]);

  const referenceCopy = [...data];

  const tree = new kdTree(referenceCopy, euclideanDistance, ["x", "y", "z"]);

  const planes: TFaultPlane[] = [];

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const nearest = tree.nearest(point, 9);
    const combinations = getCombinations(nearest.length, 2);
    const withSelf = combinations.map((combination) => [i, ...combination]);
    const withoutDuplicates = withSelf
      .filter(
        (plane) =>
          new Set(plane.map((pointIndex) => data[pointIndex].hole_id)).size ===
          plane.length
      )
      .map((combination) => {
        const plane = [
          data[combination[0]],
          data[combination[1]],
          data[combination[2]],
        ] as [TFaultIntercept, TFaultIntercept, TFaultIntercept];

        const { area, dip, azimuth } = getStats(plane);

        const faultPlane: TFaultPlane = {
          area,
          dip,
          azimuth,
          plane,
        };

        return faultPlane;
      });

    console.log({ withSelf, withoutDuplicates });

    planes.push(...withoutDuplicates);
  }

  console.log({ planes });

  const filteredPlanes = planes;
  // .filter(
  //   (plane) =>
  //     plane.dip >= dip[0] &&
  //     plane.dip <= dip[1] &&
  //     plane.azimuth >= asimuth[0] &&
  //     plane.azimuth <= asimuth[1]
  // );

  const mesh: {
    x: number[];
    y: number[];
    z: number[];
    i: number[];
    j: number[];
    k: number[];
  } = {
    x: [],
    y: [],
    z: [],
    i: [],
    j: [],
    k: [],
  };

  filteredPlanes.forEach(({ plane }) => {
    const [p1, p2, p3] = plane;

    const baseIdx = mesh.x.length; // Current number of vertices

    mesh.x.push(p1.x, p2.x, p3.x);
    mesh.y.push(p1.y, p2.y, p3.y);
    mesh.z.push(p1.z, p2.z, p3.z);

    mesh.i.push(baseIdx);
    mesh.j.push(baseIdx + 1);
    mesh.k.push(baseIdx + 2);
  });

  const meshTrace: Partial<Plotly.ScatterData> = {
    x: mesh.x.flat(),
    y: mesh.y.flat(),
    z: mesh.z.flat(),
    i: mesh.i,
    j: mesh.j,
    k: mesh.k,
    mode: "lines",
    type: "mesh3d",
    opacity: 0.5,
  };

  const points = {
    x: data.map((point) => point.x),
    y: data.map((point) => point.y),
    z: data.map((point) => point.z),
  };

  const allPointsTrace: Partial<Plotly.ScatterData> = {
    x: points.x,
    y: points.y,
    z: points.z,
    mode: "markers",
    marker: {
      size: 5,
      opacity: 0.8,
    },
    type: "scatter3d",
  };

  return (
    <div className="w-screen h-screen bg-gray-800 text-white">
      <RangeSlider range={dip} setRange={setDip} boundary={[0, 100]} step={1} />
      <RangeSlider
        range={asimuth}
        setRange={setAsimuth}
        boundary={[0, 100]}
        step={1}
      />
      <Plot
        data={[allPointsTrace, meshTrace]}
        layout={{
          title: { text: "A Fancy Plot" },
          autosize: true,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

function getCombinations(limit: number, k: number): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[]) {
    if (path.length === k) {
      result.push([...path]); // Store the valid combination
      return;
    }

    for (let i = start; i < limit; i++) {
      path.push(i); // Choose
      backtrack(i + 1, path); // Explore
      path.pop(); // Un-choose (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}

function normalizeMinMax(points: TFaultIntercept[]) {
  const x = points.map((point) => point.x);
  const y = points.map((point) => point.y);
  const z = points.map((point) => point.z);

  const xMin = Math.min(...x);
  const xMax = Math.max(...x);
  const yMin = Math.min(...y);
  const yMax = Math.max(...y);
  const zMin = Math.min(...z);
  const zMax = Math.max(...z);

  return points.map((point) => ({
    ...point,
    x: (point.x - xMin) / (xMax - xMin),
    y: (point.y - yMin) / (yMax - yMin),
    z: (point.z - zMin) / (zMax - zMin),
  }));
}

type Point = {
  x: number;
  y: number;
  z: number;
};

function euclideanDistance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}
