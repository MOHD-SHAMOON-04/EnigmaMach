import type { KeyboardProps } from '../types';
import Key from './Key';


export default function Keyboard({ type }: KeyboardProps) {
  // const layout = ["0123456789", "QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
  const layout = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
  return layout.map((row, idx) => {
    return (
      <div className="flex gap-3" key={idx}>
        {row.split('').map(char => {
          return (
            <Key type={type} char={char} key={`${type}-${char}`} />
          )
        })}
      </div>
    );
  })
}
