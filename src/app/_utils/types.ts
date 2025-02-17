export type TFaultIntercept = {
  x: number;
  y: number;
  z: number;
  class: string;
  index: number;
  hole_id: string;
};

export type TFaultPlane = [TFaultIntercept, TFaultIntercept, TFaultIntercept];

export type Index = number;

export type Combination = [Index, Index, Index];

export type Point = {
  x: number;
  y: number;
  z: number;
};

export type Plane = [Point, Point, Point];
