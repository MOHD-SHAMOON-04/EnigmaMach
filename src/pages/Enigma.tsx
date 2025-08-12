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
  useEffect(() => {
    setRotors([...enigma.getHeads()]);
  }, []);

  const glowingKey = useRef<UseRefMap>({ inp: null, out: null, key: null });

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

  const [mapping, setMapping] = useState<CharMap>(enigma.getPlugboard());

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

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

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
            className="_ROTORS bg-zinc-800 p-2 rounded flex gap-2 justify-center items-center">
            <h3 className="lg:text-xl font-bold">Setting</h3>
            {/* The 3 Rotors */}
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
