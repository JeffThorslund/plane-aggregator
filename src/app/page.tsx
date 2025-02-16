"use client";

import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import sample_data from "./sample_data.json";

export default function Home() {
  const trace1 = {
    x: unpack(sample_data, "x"),
    y: unpack(sample_data, "y"),
    z: unpack(sample_data, "z"),
    mode: "markers",
    marker: {
      size: 5,
      opacity: 0.8,
    },
    type: "scatter3d",
  } as const;

  return (
    <div className="w-screen h-screen bg-gray-800 text-white">
      <Plot
        data={[trace1]}
        layout={{
          title: { text: "A Fancy Plot" },
          autosize: true,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

type Row = { [key: string]: any };

const unpack = (rows: Row[], key: string) => rows.map((row) => row[key]);
