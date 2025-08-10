export class Enigma {
  constructor([r1 = 1, r2 = 1, r3 = 1]) {
    this.validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.rotors = [
      {
        map: "JPGVOUMFYQBENHZRDKASXLICTW",
        head: 0
      },
      {
        map: "NZJHGRCXMYSWBOUFAIVLPEKQDT",
        head: 0
      },
      {
        map: "FKQHTLXOCBJSPDZRAMEWNIUYGV",
        head: 0
      },
    ];
    this.reflector = {
      map: "EJMZALYXVBWFCRQUONTSPIKHGD"
    };
    this.setHeads([r1, r2, r3]);
    this.plugboard = {
      map: "MDLBPHSFJIXCAZQEORGTUVWKYN"
    };
  }

  reset() {
    this.rotors.forEach(r => r.head = 0);
  }

  setHeads([r1 = 1, r2 = 1, r3 = 1]) {
    this.rotors[0].head = (r1 - 1) % 26;
    this.rotors[1].head = (r2 - 1) % 26;
    this.rotors[2].head = (r3 - 1) % 26;
  }

  getHeads() {
    const arr = [];
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      arr.push(this.rotors[i].head);
    }
    return arr;
  }

  isValidPlugboardMap(map) {
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

  setPlugboard(setMap) {
    // Map -> Str
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
    // Str -> Map
    const getMap = new Map();
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

  rotate(rotorIndex) {
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
    if (newChar === ' ')
      return ' ';
    if (!this.validChars.includes(newChar))
      return newChar;
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

const machine = new Enigma([11, 11, 11]);
const plug = new Map([
  // ["A", "H"],
  // ["H", "A"],
  // ["C", "D"],
  // ["D", "C"],
  // ["Z", "L"],
  // ["L", "Z"],
  ["E", "P"],
  ["P", "E"],
  ["F", "H"],
  ["H", "F"],
  ["G", "S"],
  ["S", "G"],
  ["I", "J"],
  ["J", "I"],
  ["K", "X"],
  ["X", "K"],
  ["N", "Z"],
  ["Z", "N"],
  ["O", "Q"],
  ["Q", "O"]
]);

machine.setPlugboard(plug);
const message = "HELLO WORLD";
const encrypted = machine.scrambleString(message);
machine.setHeads([11, 11, 11]); // Reset heads to decrypt
const decrypted = machine.scrambleString(encrypted);

console.log({ encrypted, decrypted }); // Should give back "HELLO WORLD"

console.log(machine.getPlugboard());