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
    // TOTAL ABOMINATION ----------
    <div
      id={id}
      className="flex items-center justify-evenly gap-1 border-2 border-zinc-900 rounded bg-zinc-100 text-zinc-950 px-2 py-1 w-24"
    >
      {/* MAMMA MIA */}
      <div className="flex flex-col items-center">
        <div className="text-zinc-500 text-sm">{nextValue}</div>
        <div className="text-lg font-bold">{value}</div>
        <div className="text-zinc-500 text-sm">{prevValue}</div>
      </div>

      {/* UP-DOWN UP-DOWN UP-DOWN UP-DOWN UP-DOWN  */}
      <div className="flex flex-col">
        <button
          type="button"
          onClick={increase}
          className="px-2 text-lg hover:bg-emerald-100 rounded"
        >
          🔼
        </button>
        <button
          type="button"
          onClick={decrease}
          className="px-2 text-lg hover:bg-emerald-100 rounded"
        >
          🔽
        </button>
      </div>
    </div>
    // TOTAL ABOMINATION ----------

    // // I MEAN IT'S ALL RIGHT ----------
    // <select
    //   id={id}
    //   value={value}
    //   onChange={(e) => onChange(parseInt(e.target.value) || 1)}
    //   className="_ROTOR w-14 h-12 p-2 border-b-zinc-900 border-2 rounded bg-zinc-50 text-zinc-950 transition-all outline-none focus:border-emerald-200 focus:bg-emerald-50"
    // >
    //   {Array.from({ length: 26 }, (_, i) => i + 1).map((num) => (
    //     <option key={num} value={num}>
    //       {num}
    //     </option>
    //   ))}
    // </select>
    // // I MEAN IT'S ALL RIGHT ----------

    // // THE OG ----------
    // <input
    //   id={id}
    //   type="number"
    //   min="1"
    //   max="26"
    //   value={value}
    //   onChange={(e) => onChange(parseInt(e.target.value) || 1)}
    //   className="_ROTOR w-14 h-10 p-2 border-b-zinc-900 border-2 rounded bg-zinc-50 text-zinc-950 transition-all outline-none focus:border-emerald-200 focus:bg-emerald-50" />
    // // THE OG ----------
  );
}