interface RotorProps {
  value: number;
  id: string;
  onChange: (val: number) => void;
}

export default function Rotor({ value, id, onChange }: RotorProps) {
  const increase = () => onChange(value === 26 ? 1 : value + 1);
  const decrease = () => onChange(value === 1 ? 26 : value - 1);

  const prevValue = value === 1 ? 26 : value - 1;
  const nextValue = value === 26 ? 1 : value + 1;

  return (
    <div
      id={id}
      className="flex items-center justify-around gap-1 border-2 border-zinc-900 rounded bg-zinc-100 text-zinc-950 px-1 lg:px-2 lg:py-1 w-22 lg:w-24"
    >
      {/* Display */}
      <div className="flex flex-col items-center">
        <div className="text-zinc-500 text-xs lg:text-sm">{nextValue}</div>
        <div className="text-sm lg:text-lg font-bold">{value}</div>
        <div className="text-zinc-500 text-xs lg:text-sm">{prevValue}</div>
      </div>

      {/* incr & decr Buttons */}
      <div className="flex flex-col">
        <button
          type="button"
          onClick={increase}
          className="px-1 py-0.5 lg:px-2 lg:py-1 text-lg hover:bg-emerald-100 rounded"
        >
          🔼
        </button>
        <button
          type="button"
          onClick={decrease}
          className="px-1 py-0.5 lg:px-2 lg:py-1 text-lg hover:bg-emerald-100 rounded"
        >
          🔽
        </button>
      </div>
    </div>
  );
}