import type { KeyProps } from "../types";

export default function Key({ type, char }: KeyProps) {
  return (
    <button
      className="_KEY flex justify-center items-center bg-zinc-700/50 border lg:border-2 border-zinc-200 text-zinc-100 rounded w-8 h-8 lg:rounded-lg sm:w-12 sm:h-12 sm:text-xl font-bold cursor-pointer transition-all ease-in-out duration-200 select-none touch-manipulation"
      id={`${type}-${char}`}
      aria-label={`Key ${char}`}
      value={char}
      data-char={char}
    >
      {char}
    </button>
  )
}