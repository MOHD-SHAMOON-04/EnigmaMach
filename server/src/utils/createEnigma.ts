import { shuffle } from "./shuffle";
import { EnigmaMachine } from "../types";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * @param seed unique seed for deterministic shuffling
 * @param pairs number of alphabets to be paired (eg: 10 for plugboard, 13 for reflector)
 * @returns shuffled string for reflector or plugboard mapping 
 */
function generatePairs(seed: string, pairs: number): string {
  const mid = pairs;
  const firstHalfAlphs = alphabet.slice(0, mid);
  const secondHalfAlphs = alphabet.slice(mid, mid * 2);
  const remaining = alphabet.slice(mid * 2,);

  const secondHalfShuffle = shuffle(secondHalfAlphs, seed);

  let finalStr = secondHalfShuffle.split(''); // arr of (len=1 strings) == chars

  for (let i = 0; i < mid; i++) {
    const char = secondHalfAlphs[i];
    const idx = secondHalfShuffle.indexOf(char);
    const reverseChar = firstHalfAlphs[idx];

    finalStr.push(reverseChar);
  }

  return finalStr.join('') + remaining;
}

/**
 * 
 * @param seed unique seed for deterministic shuffling
 * @returns a valid `EnigmaMachine` having rotors, reflector, and plugboard
 */
function generateEnigmaMachine(seed: string): EnigmaMachine {

  // Generate components
  const rotor1 = shuffle(alphabet, seed + "rotor1");
  const rotor2 = shuffle(alphabet, seed + "rotor2");
  const rotor3 = shuffle(alphabet, seed + "rotor3");
  const reflector = generatePairs(seed + "reflector", 13);
  const plugboard = generatePairs(seed + "reflector", 10);

  return {
    rotors: [rotor1, rotor2, rotor3],
    reflector,
    plugboard,
    seed
  };
}

export default generateEnigmaMachine;