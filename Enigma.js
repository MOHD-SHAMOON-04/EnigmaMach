export class Enigma {
  constructor([r1, r2, r3]) {
    this.validChars = "abcdefghijklmnopqrstuvwxyz";
    this.rotors = [
      {
        map: "hegwzxspomryiqtcdaflvjkbun",
        head: 0
      },
      {
        map: "yfaxsvbqjltpmdwnicugehrzok",
        head: 0
      },
      {
        map: "bpsiwzadrfexumqcokyljhnvtg",
        head: 0
      },
    ];
    this.reflector = {
      map: "ghijklabcdefnmuvwxyzopqrst"
    }
    this.setHeads([r1, r2, r3]);
    // this.plugboard
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

  rotate(rotorIndex) {
    const rotor = this.rotors[rotorIndex];
    rotor.head = (rotor.head + 1) % 26;
    return rotor.head === 0;
  }

  scrambleString(str = "") {
    return str.split('').map(char => this.scrambleChar(char)).join('');
  }

  scrambleChar(char = "") {
    let newChar = char.toLowerCase();
    if (newChar === ' ') return ' ';
    if (!this.validChars.includes(newChar)) return newChar;

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

    if (this.rotate(0)) {
      if (this.rotate(1)) {
        this.rotate(2);
      }
    }

    return newChar;
  }
}
