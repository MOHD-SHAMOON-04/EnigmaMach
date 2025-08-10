import type { KeyProps } from "../types";

export default function SpaceKey({ type, char }: KeyProps) {
  return (
    <button
      className="_KEY _SPACE flex justify-center items-center bg-zinc-700/50 border lg:border-2 border-zinc-200 text-zinc-100 rounded w-48 h-8 lg:rounded-lg sm:w-72 sm:h-12 sm:text-xl font-bold cursor-pointer transition-all ease-in-out duration-200 select-none touch-manipulation"
      id={`${type}-SPACE`}
      aria-label={`Key SPACE`}
      value={char}
      data-char={char}
    >
      {char}
    </button>
  )
}