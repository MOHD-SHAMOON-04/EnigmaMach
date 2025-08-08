interface RotorProps {
  value: number;
  id: string;
  onChange: (val: number) => void;
}

export default function Rotor({ value, id, onChange }: RotorProps) {
  return (
    <input
      id={id}
      type="number"
      min="1"
      max="26"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="_ROTOR w-14 h-10 p-2 border-b-zinc-900 border-2 rounded bg-zinc-50 text-zinc-950 transition-all outline-none focus:border-emerald-200 focus:bg-emerald-50" />
  )
}