import { useEffect, useRef, useState } from "react";
import Keyboard from "../components/Keyboard";
import Rotor from "../components/Rotor";
import CopyBtn from '../components/CopyBtn';
import EnigmaEngine from "../utils/Enigma";
import type { UseRefMap } from "../types";

const enigma = new EnigmaEngine([1, 1, 1]);

const validKey = (enteredKey: string): boolean => /^[A-Z]$/.test(enteredKey);

function Enigma() {
  const [rotors, setRotors] = useState([] as number[]);
  useEffect(() => {
    setRotors([...enigma.getHeads()]);
  }, []);

  const glowingKey = useRef<UseRefMap>({ inp: null, out: null, key: null });

  // utility for encoding ----------
  const encodeKey = (enteredKey: string) => {
    const encoded = enigma.scrambleChar(enteredKey);
    const heads = enigma.getHeads();
    setRotors([...heads]);
    return encoded;
  };
  // utility for encoding ----------

  // Keyboard events handling ----------
  const physicalKeyPress = (e: KeyboardEvent) => {
    const enteredKey = e.key.toUpperCase();

    if (!validKey(enteredKey)) return;
    if (glowingKey.current.key !== null) return;

    const encodedKey = encodeKey(enteredKey);
    setInputText((prev) => prev + enteredKey);
    setOutputText((prev) => prev + encodedKey);

    const inpKey = document.querySelector(`#inp-${enteredKey}`) as HTMLElement | null;
    const outKey = document.querySelector(`#out-${encodedKey}`) as HTMLElement | null;
    if (!inpKey || !outKey) return;

    glowOnAll(inpKey, outKey, enteredKey);
  };

  const physicalKeyUp = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === glowingKey.current.key) {
      const { inp, out } = glowingKey.current;
      if (inp && out) glowOffAll(inp, out);
    }
  };
  // Keyboard events handling ----------

  // Common utility functions for key glow ----------
  const glowOnAll = (inpKey: HTMLElement, outKey: HTMLElement, key: string) => {
    inpKey.classList.add('glow');
    outKey.classList.add('glow');
    glowingKey.current = { inp: inpKey, out: outKey, key };
  };

  const glowOffAll = (inpKey: HTMLElement, outKey: HTMLElement) => {
    inpKey.classList.remove('glow');
    outKey.classList.remove('glow');
    glowingKey.current = { inp: null, out: null, key: null };
  };
  // Common utility functions for key glow ----------

  // Handling window change/blur aka tab change, meta key ----------
  const windowBlur = () => {
    const { inp, out } = glowingKey.current;
    if (inp && out) glowOffAll(inp, out);
  }
  // Handling window change/blur aka tab change, meta key ----------

  // Pointer events handling(touch+mouse) ----------
  const handleVirtualKeyDown = (e: React.PointerEvent) => {
    const ele = e.target as HTMLElement;

    if (!ele.classList.contains('_KEY')) return;

    const char = ele.dataset.char;
    if (!char || !validKey(char)) return;
    if (glowingKey.current.key !== null) return;

    const encodedKey = encodeKey(char);
    setInputText((prev) => prev + char);
    setOutputText((prev) => prev + encodedKey);

    const inpKey = document.querySelector(`#inp-${char}`) as HTMLElement | null;
    const outKey = document.querySelector(`#out-${encodedKey}`) as HTMLElement | null;
    if (!inpKey || !outKey) return;

    glowOnAll(inpKey, outKey, char);
  };

  const handleVirtualKeyUp = () => {
    const { inp, out } = glowingKey.current;
    if (inp && out) glowOffAll(inp, out);
  };
  // Pointer events handling(touch+mouse) ----------

  // handler for updating rotor setting ----------
  const handleRotorChange = (index: number, newVal: number) => {
    console.log(`${index} : ${newVal}`);
    const newRotors = [...rotors];
    newRotors[index] = newVal;

    setRotors(newRotors);
    enigma.setHeads(newRotors);
  };
  // handler for updating rotor setting ----------

  // handler for copying inp/out ----------
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied:', text);

    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };
  // handler for copying inp/out ----------

  useEffect(() => {
    document.addEventListener('keydown', physicalKeyPress);
    document.addEventListener('keyup', physicalKeyUp);
    window.addEventListener('blur', windowBlur);

    return () => {
      document.removeEventListener('keydown', physicalKeyPress);
      document.removeEventListener('keyup', physicalKeyUp);
      window.removeEventListener('blur', windowBlur);
    }
  }, []);

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center items-start mt-4 gap-6 px-4">

      {/* Left side: Keyboards */}
      <div className="flex flex-col justify-center items-center">
        <Keyboard type="out" />

        <Keyboard
          type="inp"
          onPointerDown={handleVirtualKeyDown}
          onPointerUp={handleVirtualKeyUp}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-6 font-mono">

        {/* Right side: Settings */}
        <div
          id="rotors"
          className="_ROTORS bg-zinc-800 p-2 rounded flex gap-2 justify-center items-center">
          <h3 className="text-xl font-bold">Setting: </h3>
          <div className="flex flex-row-reverse">
            {rotors.map((r, idx) => (
              <Rotor
                value={r}
                id={`rotor-${idx}`}
                key={idx}
                onChange={(newVal) => handleRotorChange(idx, newVal)}
              />
            ))}
          </div>
        </div>

        {/* Right side: INPUT/OUTPUT text fields */}
        <div className="w-full max-w-[500px]">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="input-field" className="font-semibold">Input</label>
            <CopyBtn onClick={() => handleCopy(inputText)} />
          </div>
          <textarea
            id="input-field"
            placeholder="Input Text"
            defaultValue={inputText}
            disabled={true}
            onKeyDown={(e) => e.preventDefault()}
            rows={4}
            className="w-full resize-y p-2.5 text-lg outline-none border-2 border-blue-300 bg-zinc-50 text-zinc-950 rounded"
          ></textarea>
        </div>

        <div className="w-full max-w-[500px] mt-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="output-field" className="font-semibold">Output</label>
            <CopyBtn onClick={() => handleCopy(outputText)} />
          </div>
          <textarea
            id="output-field"
            placeholder="Output Text"
            defaultValue={outputText}
            disabled={true}
            onKeyDown={(e) => e.preventDefault()}
            rows={4}
            className="w-full resize-y p-2.5 text-lg outline-none border-2 border-blue-300 bg-zinc-50 text-zinc-950 rounded"
          ></textarea>
        </div>

        {/* <textarea
          id="input-field"
          placeholder="Input Text"
          defaultValue={inputText}
          disabled={true}
          onKeyDown={(e) => e.preventDefault()}
          // value={inputText}
          // onChange={handleInputChange}
          rows={4}
          className="w-full max-w-[500px] resize-y p-2.5 text-lg outline-none border-2 border-blue-300 bg-zinc-50 text-zinc-950 rounded"
        ></textarea>
        <textarea
          id="output-field"
          placeholder="Output Text"
          defaultValue={outputText}
          disabled={true}
          onKeyDown={(e) => e.preventDefault()}
          rows={4}
          className="w-full max-w-[500px] resize-y p-2.5 text-lg outline-none border-2 border-blue-300 bg-zinc-50 text-zinc-950 rounded"
        ></textarea> */}

      </div>
    </div>
  )
}

export default Enigma;
