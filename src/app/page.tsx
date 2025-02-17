"use client";

import dynamic from "next/dynamic";
import sample_data from "./sample_data.json";
import { normalizeFields } from "./_utils/normalization";
import { TFaultIntercept } from "./_utils/types";
import { buildPlanes } from "./_utils/buildPlanes";

const data = normalizeFields(
  sample_data
    .filter((d) => d.class === Number(2) || d.class === Number(3))
    .map((d, i) => ({
      ...d,
      index: i,
    })) as TFaultIntercept[]
);

export default function Home() {
  const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

  const planes = buildPlanes(data, 10);

  const filteredPlanes = planes;

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

  filteredPlanes.forEach((plane) => {
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
    x: new Float32Array(mesh.x),
    y: new Float32Array(mesh.y),
    z: new Float32Array(mesh.z),
    i: new Float32Array(mesh.i),
    j: new Float32Array(mesh.j),
    k: new Float32Array(mesh.k),
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
      <div># of planes: {planes.length}</div>
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
