import { useEffect, useRef, useState } from "react";
import Keyboard from "../components/Keyboard";
import Rotor from "../components/Rotor";
import EnigmaEngine from "../utils/Enigma";
import type { CharMap, UseRefMap } from "../types";
import TextField from "../components/TextField";
import Plugboard from "../components/Plugboard";

const enigma = new EnigmaEngine([1, 1, 1]);

const validKey = (enteredKey: string): boolean => /^[A-Z ]$/.test(enteredKey);

function Enigma() {
  const [rotors, setRotors] = useState([] as number[]);
  const glowingKey = useRef<UseRefMap>({ inp: null, out: null, key: null });
  const [mapping, setMapping] = useState<CharMap>(enigma.getPlugboard());

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // utility for encoding ----------
  const encodeChar = (enteredKey: string) => {
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

    const encodedKey = encodeChar(enteredKey);
    setInputText((prev) => prev + enteredKey);
    setOutputText((prev) => prev + encodedKey);

    const inpKey = document.querySelector(`#inp-${enteredKey !== ' ' ? enteredKey : "SPACE"}`) as HTMLElement | null;
    const outKey = document.querySelector(`#out-${encodedKey !== ' ' ? encodedKey : "SPACE"}`) as HTMLElement | null;
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

    const encodedKey = encodeChar(char);
    setInputText((prev) => prev + char);
    setOutputText((prev) => prev + encodedKey);

    const inpKey = document.querySelector(`#inp-${char !== ' ' ? char : "SPACE"}`) as HTMLElement | null;
    const outKey = document.querySelector(`#out-${encodedKey !== ' ' ? encodedKey : "SPACE"}`) as HTMLElement | null;
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
    // console.log(`${index} : ${newVal}`);
    const newRotors = [...rotors];
    newRotors[index] = newVal;

    setRotors(newRotors);
    enigma.setHeads(newRotors);
  };
  // handler for updating rotor setting ----------

  // handler for copying inp/out ----------
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // console.log('Copied:', text);

    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };
  // handler for copying inp/out ----------

  // handler for updating mappings in the machine ----------
  const handlePlugboardUpdate = (newMapping: CharMap) => {
    // // PROD
    enigma.setPlugboard(newMapping);            // update machine
    setMapping(new Map(enigma.getPlugboard())); // clone to force re-render

    // // DEV
    // // Enigma update
    // console.log(`Before Update =>`, enigma.getPlugboard());
    // const res = enigma.setPlugboard(newMapping);
    // console.log(`After Update =>`, enigma.getPlugboard());
    // console.log("Update successful: ", res);

    // // State Update
    // // setMapping(new Map(enigma.getPlugboard()));
    // setMapping(new Map(enigma.getPlugboard()));
  };
  // handler for updating mappings in the machine ----------

  // Reset Enigma ----------
  const resetEnigma = () => {
    enigma.reset();
    setRotors([...enigma.getHeads()]);
    glowingKey.current = { inp: null, out: null, key: null };
    setMapping(new Map(enigma.getPlugboard()));
    setInputText('');
    setOutputText('');
  };
  // Reset Enigma ----------

  useEffect(() => {
    setRotors([...enigma.getHeads()]);
    document.addEventListener('keydown', physicalKeyPress);
    document.addEventListener('keyup', physicalKeyUp);
    window.addEventListener('blur', windowBlur);

    return () => {
      document.removeEventListener('keydown', physicalKeyPress);
      document.removeEventListener('keyup', physicalKeyUp);
      window.removeEventListener('blur', windowBlur);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col-reverse lg:flex-row justify-center lg:items-start mt-4 gap-6 px-4">

        {/* Left side: Keyboards */}
        <div className="flex flex-col justify-center items-center">
          <Keyboard type="out" />

          <Keyboard
            type="inp"
            onPointerDown={handleVirtualKeyDown}
            onPointerUp={handleVirtualKeyUp}
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-3 lg:gap-6 font-mono">

          {/* Right side: Settings */}
          <div
            id="rotors"
            className="_ROTORS bg-zinc-800 p-3 lg:p-2 rounded flex flex-col lg:flex-row gap-3 lg:gap-2 justify-center items-center w-full lg:w-auto">

            {/* Header and Reset Button Row */}
            <div className="flex justify-between items-center w-full lg:w-auto lg:flex-col lg:gap-0">
              <h3 className="text-lg lg:text-xl font-bold">Settings</h3>

              {/* Reset Button */}
              <button
                className="group relative p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all duration-200 ease-in-out lg:mt-2"
                onClick={resetEnigma}
                title="Reset Enigma"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill="currentColor"
                  className="transition-transform duration-200 group-hover:rotate-180 group-active:rotate-180 lg:w-5 lg:h-5"
                >
                  <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q88-15 144-82.5T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
                </svg>

                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Reset Enigma Machine
                </span>
              </button>
            </div>

            {/* The 3 Rotors */}
            <div className="flex flex-row-reverse justify-center gap-1 w-full lg:w-auto">
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
          <div className="flex lg:flex-col gap-2 lg:w-full">
            <TextField
              handleCopy={handleCopy}
              text={inputText}
              setText={setInputText}
              label={"Input"}
            />
            <TextField
              handleCopy={handleCopy}
              text={outputText}
              setText={setOutputText}
              label={"Output"}
            />
          </div>

        </div>
      </div>

      {/* // Plugboard to be Inserted here */}
      <div className="mt-4 flex">
        <Plugboard
          mapping={mapping}
          updateMapping={handlePlugboardUpdate}
        />
      </div>
    </div>
  )
}

export default Enigma;
