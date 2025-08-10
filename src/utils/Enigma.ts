import type { Reflector, Rotor, Plugboard, CharMap } from '../types';

export default class EnigmaEngine {
  validChars: string;
  rotors: Rotor[];
  reflector: Reflector;
  plugboard: Plugboard;

  constructor([r1 = 1, r2 = 1, r3 = 1]: number[]) {
    this.validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.rotors = [
      {
        // Rotor #VI - 1939 - M3 & M4 Naval (FEB 1942)
        map: "JPGVOUMFYQBENHZRDKASXLICTW",
        head: 0
      },
      {
        // Rotor #VII - 1939 - M3 & M4 Naval (FEB 1942)
        map: "NZJHGRCXMYSWBOUFAIVLPEKQDT",
        head: 0
      },
      {
        // Rotor #VIII - 1939 - M3 & M4 Naval (FEB 1942)
        map: "FKQHTLXOCBJSPDZRAMEWNIUYGV",
        head: 0
      },
    ];
    this.reflector = {
      // Rotor #Reflector_A
      map: "EJMZALYXVBWFCRQUONTSPIKHGD"
    }
    this.setHeads([r1, r2, r3]);
    this.plugboard = {
      map: "MDLBPHSFJIXCAZQEORGTUVWKYN"
    }
  }

  reset() {
    this.rotors.forEach(r => r.head = 0);
  }

  setHeads([r1, r2, r3]: number[]) {
    this.rotors[0].head = (r1 - 1) % 26;
    this.rotors[1].head = (r2 - 1) % 26;
    this.rotors[2].head = (r3 - 1) % 26;
  }

  getHeads() {
    return this.rotors.map(r => r.head + 1);
    // as wrapping logic is already handled internally
  }

  isValidPlugboardMap(map: CharMap) {
    const seen = new Set();

    for (const [a, b] of map.entries()) {
      if (a === b) return false; // No self pairing
      seen.add(a);
      seen.add(b);
      if (map.get(b) !== a) return false; // not symmetric
    }

    return [...map.keys()].every(c => this.validChars.includes(c)) &&
      [...map.values()].every(c => this.validChars.includes(c)) &&
      seen.size <= 20; // at max: 10 pairs of 2 ele each
  }

  setPlugboard(setMap: CharMap) {
    // should receive a Map() representaion of the plugboard
    if (!this.isValidPlugboardMap(setMap)) return false;

    // yess a valid plugboard
    let newStr = "";

    for (const char of this.validChars) {
      if (setMap.has(char)) {
        newStr += setMap.get(char);
      } else {
        newStr += char;
      }
    }

    this.plugboard.map = newStr;
    return true;
  }

  getPlugboard() {
    // should return a Map() representaion of the plugboard
    const getMap = new Map() as CharMap;
    const alphabet = this.validChars;
    const currentStr = this.plugboard.map.toUpperCase();

    // paranoid err checking
    if (currentStr.length !== 26) {
      throw new Error("Plugboard string must be exactly 26 characters.");
    }

    for (let i = 0; i < 26; i++) {
      const from = alphabet[i];
      const to = currentStr[i];

      if (from !== to) {
        // again paranoid err checking
        // Check for consistency
        if (getMap.has(to) && getMap.get(to) !== from) {
          throw new Error(`Inconsistent mapping: ${from} -> ${to}, but ${to} already mapped to ${getMap.get(to)}`);
        }

        getMap.set(from, to);
        getMap.set(to, from); // Ensure bidirectional
      }
    }

    return getMap;
  }

  rotate(rotorIndex: number) {
    const rotor = this.rotors[rotorIndex];
    rotor.head = (rotor.head + 1) % 26;
    return rotor.head === 0;
  }

  scrambleString(str = "") {
    return str
      .toUpperCase()
      .split('')
      .map(char => this.scrambleChar(char)).join('');
  }

  scrambleChar(char = "") {
    let newChar = char.toUpperCase();
    if (newChar === ' ') return ' ';
    if (!this.validChars.includes(newChar)) return newChar;

    // Plugboard 1st map
    newChar = this.plugboard.map[this.validChars.indexOf(newChar)];

    // forward pass
    for (let i = 0; i < this.rotors.length; i++) {
      const r = this.rotors[i];

      // input->map
      const idx = this.validChars.indexOf(newChar);
      newChar = r.map[(r.head + idx + 26) % 26];
    }

    // reflector pass
    let refInd = this.validChars.indexOf(newChar);
    newChar = this.reflector.map[refInd];

    // backward pass
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      const r = this.rotors[i];

      // map->input
      const idx = r.map.indexOf(newChar);
      newChar = this.validChars[(idx - r.head + 26) % 26];
    }

    // Plugboard 2nd map
    newChar = this.plugboard.map[this.validChars.indexOf(newChar)];

    if (this.rotate(0)) {
      if (this.rotate(1)) {
        this.rotate(2);
      }
    }

    return newChar;
  }
}

(() => {
  const machine = new EnigmaEngine([1, 1, 1]);
  const plug = new Map([
    ["A", "M"],
    ["M", "A"],
    ["B", "D"],
    ["D", "B"],
    // ["C", "L"],
    // ["L", "C"],
    // ["E", "P"],
    // ["P", "E"],
    // ["F", "H"],
    // ["H", "F"],
    // ["G", "S"],
    // ["S", "G"],
    // ["I", "J"],
    // ["J", "I"],
    // ["K", "X"],
    // ["X", "K"],
    // ["N", "Z"],
    // ["Z", "N"],
    // ["O", "Q"],
    // ["Q", "O"]
  ]) as CharMap;

  const res = machine.setPlugboard(plug);
  const map = machine.getPlugboard();
  console.log(res, machine.plugboard.map, map);
})();

// The original wirings/mapping used, taken from =>
// https://en.wikipedia.org/wiki/Enigma_rotor_details#Rotor_wiring_tables