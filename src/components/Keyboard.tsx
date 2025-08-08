import type { KeyboardProps } from '../types';
import Key from './Key';

export default function Keyboard({ type, onPointerDown, onPointerUp }: KeyboardProps) {
  const layout = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];

  return (
    <div
      id={`${type}-keyboard`}
      className="_KEYBOARD bg-zinc-800 p-4 rounded m-auto flex flex-col items-center mb-6 gap-3"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <h2 className="mr-auto text-2xl font-bold mb-2">
        {type === 'out' ? 'Output' : 'Input'} Keyboard
      </h2>
      {layout.map((row, idx) =>
        <div className="_ROW flex gap-3" key={idx}>
          {row
            .split('')
            .map(char => <Key type={type} char={char} key={`${type}-${char}`} />)
          }
        </div>
      )}
    </div>
  );
}
