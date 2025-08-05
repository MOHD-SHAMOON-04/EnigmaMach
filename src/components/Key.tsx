import type { KeyProps } from "../types";

export default function Key({ type, char }: KeyProps) {
  return (
    <button
      className="_KEY flex justify-center items-center bg-zinc-700/50 border-2 border-zinc-200 text-zinc-100 rounded-lg w-12 h-12 text-xl font-bold cursor-pointer transition-all ease-in-out duration-200"
      id={`${type}-${char.toLowerCase()}`}
      aria-label={`Key ${char}`}
      value={char.toLowerCase()}
    >
      {char}
    </button>
  )
  /* 
  .row  =>> "flex gap-4"
  
  .key  ==> "flex justify-center items-center bg-zinc-700 border-2 border-zinc-200 text-zinc-100 rounded w-12 h-12 text-lg font-bold cursor-pointer transition-all ease-in-out duration-200"
  
  .glow  ==> "border-gold-200 text-gold-200 scale-110 shadow-gold-300 shadow-[0_0_15px_3px]"
  */
}