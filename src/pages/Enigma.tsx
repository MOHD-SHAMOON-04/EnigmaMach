import { useEffect, useRef, useState } from "react";
import Keyboard from "../components/Keyboard";
import Rotor from "../components/Rotor";
import EnigmaEngine from "../utils/Enigma";
import type { CharMap, UseRefMap } from "../types";
import TextField from "../components/TextField";
import Plugboard from "../components/Plugboard";
import { useParams } from "react-router";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const enigma = new EnigmaEngine([1, 1, 1]);

const validKey = (enteredKey: string): boolean => /^[A-Z ]$/.test(enteredKey);

function Enigma() {
  const [rotors, setRotors] = useState([] as number[]);
  const glowingKey = useRef<UseRefMap>({ inp: null, out: null, key: null });
  const [mapping, setMapping] = useState<CharMap>(enigma.getPlugboard());

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // Machine fetch status states
  const [machineStatus, setMachineStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
    show: boolean;
  }>({ loading: false, success: false, error: null, show: false });

  const { machineId } = useParams();

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
    if (e.key === " ") e.preventDefault();
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

  useEffect(() => {
    const fetchMachine = async () => {
      if (!machineId) return;

      setMachineStatus({ loading: true, success: false, error: null, show: true });

      try {
        const res = await fetch(`${API_URL}/enigma?machineId=${machineId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch machine: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        // Validate the data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid machine data received');
        }

        enigma.setAllDefaults(data);
        resetEnigma();
        setMapping(new Map(enigma.getPlugboard()));

        setMachineStatus({ loading: false, success: true, error: null, show: true });

        // Auto-hide success notification after 4 seconds with slide out
        setTimeout(() => {
          setMachineStatus(prev => ({ ...prev, show: false }));
        }, 4000);

        // Remove from DOM after animation completes
        setTimeout(() => {
          setMachineStatus(prev => ({ ...prev, success: false }));
        }, 4500);

      } catch (error) {
        console.error('Machine fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load machine configuration';
        setMachineStatus({ loading: false, success: false, error: errorMessage, show: true });

        setTimeout(() => {
          setMachineStatus(prev => ({ ...prev, show: false }));
        }, 10000);
      }
    };

    fetchMachine();
  }, [machineId]);

  const dismissError = () => {
    setMachineStatus(prev => ({ ...prev, show: false }));
    setTimeout(() => {
      setMachineStatus(prev => ({ ...prev, error: null }));
    }, 300);
  };

  return (
    <div className="flex flex-col">
      {/* Sliding Machine Status Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 scale-90 sm:scale-100">
        {/* Loading Notification */}
        {machineStatus.loading && (
          <div className={`transform transition-all duration-500 ease-out ${machineStatus.show
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95'
            }`}>
            <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-4 rounded-xl shadow-2xl min-w-[300px]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="animate-spin w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <p className="text-blue-300 font-medium">Loading Configuration</p>
                  <p className="text-blue-200/70 text-sm">Fetching machine data...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {machineStatus.success && (
          <div className={`transform transition-all duration-500 ease-out ${machineStatus.show
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95'
            }`}>
            <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 p-4 rounded-xl shadow-2xl min-w-[300px]">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 border-2 border-emerald-400/20 rounded-full animate-ping"></div>
                </div>
                <div className="flex-1">
                  <p className="text-emerald-300 font-medium">Configuration Loaded!</p>
                  <p className="text-emerald-200/70 text-sm">
                    Machine ID: <span className="font-mono text-emerald-300">{machineId}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {machineStatus.error && (
          <div className={`transform transition-all duration-500 ease-out ${machineStatus.show
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95'
            }`}>
            <div className="bg-slate-900/95 backdrop-blur-md border border-red-500/50 p-4 rounded-xl shadow-2xl min-w-[300px] max-w-[400px]">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-red-300 font-medium">Configuration Failed</p>
                  <p className="text-red-200/70 text-sm mt-1 leading-relaxed">{machineStatus.error}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
                    >
                      Retry
                    </button>
                    <button
                      onClick={dismissError}
                      className="text-xs bg-slate-600/20 hover:bg-slate-600/30 text-slate-300 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
