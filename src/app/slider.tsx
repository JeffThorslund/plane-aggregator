import { useState } from "react";

export type MinMax = [number, number];

type RangeSliderProps = {
  range: MinMax;
  setRange: React.Dispatch<React.SetStateAction<MinMax>>;
  boundary: MinMax;
  step?: number;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  range: [rangeMin, rangeMax],
  setRange,
  boundary: [boundaryMin, boundaryMax],
  step = 0.5,
}) => {
  // Temporary state for the slider value while dragging
  const [tempRange, setTempRange] = useState<MinMax>([rangeMin, rangeMax]);

  // Handle the slider value change (for live tracking during drag)
  const handleChange = (index: number, value: number) => {
    setTempRange((prev) => {
      const newRange = [...prev] as MinMax;
      newRange[index] = value;
      return newRange[0] > newRange[1] ? prev : newRange;
    });
  };

  // Handle release (commit the value when the user releases the slider)
  const handleRelease = () => {
    setRange(tempRange); // Commit the temp range value to final state
  };

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-4">
        <span>Min: {tempRange[0]}</span>
        <span>Max: {tempRange[1]}</span>
      </div>

      {/* Min slider */}
      <input
        type="range"
        min={boundaryMin}
        max={boundaryMax}
        step={step}
        value={tempRange[0]}
        onChange={(e) => handleChange(0, Number(e.target.value))}
        onMouseUp={handleRelease} // Commit on release
        onTouchEnd={handleRelease} // Commit on touch release
        className="w-full appearance-none h-2 bg-gray-300 rounded-lg outline-none cursor-pointer transition-all focus:ring focus:ring-blue-300"
      />

      {/* Max slider */}
      <input
        type="range"
        min={boundaryMin}
        max={boundaryMax}
        step={step}
        value={tempRange[1]}
        onChange={(e) => handleChange(1, Number(e.target.value))}
        onMouseUp={handleRelease} // Commit on release
        onTouchEnd={handleRelease} // Commit on touch release
        className="w-full appearance-none h-2 bg-gray-300 rounded-lg outline-none cursor-pointer transition-all focus:ring focus:ring-blue-300 mt-4"
      />
    </div>
  );
};

export default RangeSlider;
