import { useEffect, useState } from "react";
import Keyboard from "../components/Keyboard";
import type { KeyPair } from "../types";
import EnigmaEngine from "../utils/Enigma";

function Enigma() {
  const [rotors, setRotors] = useState({ r1: 1, r2: 1, r3: 1 });
  const [keyPair, setKeyPair] = useState({ inp: null, out: null } as KeyPair);
  const enigma = new EnigmaEngine([1, 1, 1]);

  useEffect(() => {
    const keyGlowOn = (keyEle: HTMLElement) => {
      if (keyEle) {
        keyEle.classList.add('glow');
      }
    };

    const keyGlowOff = (keyEle: HTMLElement) => {
      if (keyEle) {
        keyEle.classList.remove('glow');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const enteredKey = e.key.toLowerCase();
      if (e.key.length > 1 || keyPair.inp != null) return;

      // const alphs = "abcdefghijklmnopqrstuvwxyz0123456789";
      const alphs = "abcdefghijklmnopqrstuvwxyz";
      if (!alphs.includes(enteredKey)) return;

      handleEncoding(enteredKey);
    };

    const handleKeyUp = () => {
      if (keyPair.inp) {
        keyGlowOff(keyPair.inp);
        setKeyPair({ ...keyPair, inp: null });
      }
      if (keyPair.out) {
        keyGlowOff(keyPair.out);
        setKeyPair({ ...keyPair, out: null });
      }
    };

    const handleEncoding = (enteredKey: string) => {
      const encInp = enigma.scrambleChar(enteredKey);
      const heads = enigma.getHeads();
      setRotors({
        r1: heads[0],
        r2: heads[1],
        r3: heads[2]
      })

      const inpRef = document.querySelector(`#inp-${enteredKey}`) as HTMLElement;
      const outRef = document.querySelector(`#out-${encInp}`) as HTMLElement;

      // inputField.value += enteredKey;
      // outputField.value += encInp;

      keyGlowOn(inpRef);
      keyGlowOn(outRef);

      setKeyPair({
        inp: inpRef,
        out: outRef,
      })
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, []);

  return (
    <div className="flex justify-evenly items-start mt-4">

      {/* Left side: Keyboards */}
      <div className="flex flex-col justify-center items-center">
        <div
          id="out-keyboard"
          className="bg-zinc-800 p-4 rounded m-auto flex flex-col items-center mb-6 gap-3"
        >
          <h2 className="mr-auto text-2xl font-bold mb-2">Output Keyboard</h2>
          <Keyboard type={"out"} />
        </div>

        <div
          id="inp-keyboard"
          className="bg-zinc-800 p-4 rounded m-auto flex flex-col items-center mb-6 gap-4"
          onClick={e => {
            const ele = e.target as HTMLButtonElement;
            if (ele.classList.contains('_KEY')) {
              ele.classList.add('glow');
              setTimeout(() => {
                ele.classList.remove('glow');
              }, 2000);
            }
          }}
        >
          <h2 className="mr-auto text-2xl font-bold mb-2">Input Keyboard</h2>
          <Keyboard type={"inp"} />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-6 font-mono">

        {/* Right side: Settings */}
        <div
          id="rotors"
          className="bg-zinc-800 p-2 rounded flex gap-2 justify-center items-center">
          <h3 className="text-xl font-bold">Setting: </h3>
          <input
            type="number"
            min="1"
            max="26"
            defaultValue={1}
            className="_ROTOR w-14 h-10 p-2 border-b-zinc-900 border-2 rounded bg-zinc-50 text-zinc-950 transition-all outline-none focus:border-emerald-200 focus:bg-emerald-50" />
          <input
            type="number"
            min="1"
            max="26"
            defaultValue={1}
            className="_ROTOR w-14 h-10 p-2 border-b-zinc-900 border-2 rounded bg-zinc-50 text-zinc-950 transition-all outline-none focus:border-emerald-200 focus:bg-emerald-50" />
          <input
            type="number"
            min="1"
            max="26"
            defaultValue={1}
            className="_ROTOR w-14 h-10 p-2 border-b-zinc-900 border-2 rounded bg-zinc-50 text-zinc-950 transition-all outline-none focus:border-emerald-200 focus:bg-emerald-50" />
        </div>

        {/* Right side: INPUT/OUTPUT text fields */}
        <textarea
          id="input-field"
          placeholder="Input Text"
          rows={4}
          className="w-full max-w-[500px] resize-y p-2.5 text-lg outline-none border-2 border-blue-300 bg-zinc-50 text-zinc-950 rounded"
        ></textarea>
        <textarea
          id="output-field"
          placeholder="Output Text"
          rows={4}
          className="w-full max-w-[500px] resize-y p-2.5 text-lg outline-none border-2 border-blue-300 bg-zinc-50 text-zinc-950 rounded"
        ></textarea>

      </div>
    </div>
  )
}

export default Enigma;

// TODO:
// - link rotors
// - link input and output text fields with JIT enc & dec
// - fix infinite glow