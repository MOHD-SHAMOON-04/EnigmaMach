import type { KeyboardProps } from '../types';
import Key from './Key';
import SpaceKey from './SpaceKey';

export default function Keyboard({ type, onPointerDown, onPointerUp }: KeyboardProps) {
  const layout = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];

  return (
    <div
      id={`${type}-keyboard`}
      className="_KEYBOARD bg-zinc-800 p-2 sm:p-4 rounded mx-auto flex flex-col items-center mb-3 sm:mb-6 gap-3"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <h2 className="mr-auto text-lg sm:text-xl lg:text-2xl font-bold mb-1 lg:mb-2">
        {type === 'out' ? 'Output' : 'Input'} Keyboard
      </h2>
      {layout.map((row, idx) =>
        <div className="_ROW flex gap-[8.2px] sm:gap-3" key={idx}>
          {row
            .split('')
            .map(char => <Key type={type} char={char} key={`${type}-${char}`} />)
          }
        </div>
      )}
      <div className="_ROW flex select-none touch-manipulation">
        <SpaceKey type={type} char={" "} />
      </div>
    </div>
  );
}
