import { useEffect, useRef } from 'react';

export default function PlugKey({
  char, reportPosition, isWaiting
}: {
  char: string,
  reportPosition?: (char: string, el: HTMLButtonElement | null) => void,
  isWaiting: boolean,
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // when mounted, the component will send back its own Rect()
  useEffect(() => {
    if (reportPosition && ref.current) {
      reportPosition(char, ref.current);
    }
  }, [reportPosition, char]);

  return (
    <button
      ref={ref}
      className={`_PLUGBOARD_KEY ${isWaiting ? 'glow' : 'border-zinc-200'} flex justify-center items-center bg-zinc-600/70 border lg:border-2 text-zinc-100 rounded w-7 h-10 lg:rounded-lg sm:w-11 sm:h-15 sm:text-xl font-bold cursor-pointer transition-all ease-in-out duration-200 select-none touch-manipulation`}
      id={`plug-${char}`}
      aria-label={`Plug Key ${char}`}
      value={char}
      data-char={char}
    >
      {char}
    </button>
  )
}