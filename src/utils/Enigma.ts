import type { Reflector, Rotor, Plugboard } from '../types';

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

// The original wirings/mapping used, taken from =>
// https://en.wikipedia.org/wiki/Enigma_rotor_details#Rotor_wiring_tables