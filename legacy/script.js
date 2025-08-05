import { Enigma } from "./Enigma.js";
const inpKeyboard = document.querySelector('#inp-keyboard');
const outKeyboard = document.querySelector('#out-keyboard');
const rotors = document.querySelectorAll(".rotor");
const inputField = document.querySelector("#input-field");
const outputField = document.querySelector("#output-field");

const enigma = new Enigma([1, 1, 1]);

// rotors events ---------------------------------
const setRotors = () => {
  const arr = [];
  for (let i = rotors.length - 1; i >= 0; i--) {
    arr.push(Math.min(parseInt(rotors[i].value), 26));
  }
  console.log('Rotor positions:', enigma.getHeads());
  enigma.setHeads(arr);
  console.log('Rotor positions:', enigma.getHeads());
};

rotors.forEach(r => {
  r.addEventListener('keydown', (e) => e.stopPropagation());
  r.addEventListener('change', () => setRotors());
});
// rotors events ---------------------------------

// keyboard initialization ---------------------------------
const createKeyboardRow = (rowData, keyboardType) => {
  const row = document.createElement('div');
  row.classList.add('row');

  rowData.split('').forEach(char => {
    const key = document.createElement('button');
    const keyId = `${keyboardType}-${char.toLowerCase()}`;

    key.classList.add('key');
    key.ariaLabel = `Key ${char}`;
    key.value = char.toLowerCase();
    key.id = keyId;
    key.innerText = char;

    // key.addEventListener('click', () => handleEncoding(char.toLowerCase()));
    key.addEventListener('mousedown', () => handleEncoding(char.toLowerCase()));
    key.addEventListener('mouseup', () => handleKeyUp());

    row.appendChild(key);
  });

  return row;
};

const initKeyboards = () => {
  // const keyboardInitData = ["0123456789", "QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
  const keyboardInitData = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
  keyboardInitData.forEach(rowData => {
    inpKeyboard.appendChild(createKeyboardRow(rowData, 'inp'));
    outKeyboard.appendChild(createKeyboardRow(rowData, 'out'));
  });
};
// keyboard initialization ---------------------------------

// glow events ------------------------------------------------------------
const keyGlowOn = (keyEle) => {
  if (keyEle) {
    keyEle.classList.add('glow');
  }
};

const keyGlowOff = (keyEle) => {
  if (keyEle) {
    keyEle.classList.remove('glow');
  }
};
// glow events ------------------------------------------------------------

// Keyboard events ------------------------------------------------------
let pressedInput = null;
let pressedOutput = null;

const handleKeyDown = (e) => {
  const enteredKey = e.key.toLowerCase();
  if (e.key.length > 1 || pressedInput != null) return;

  // const alphs = "abcdefghijklmnopqrstuvwxyz0123456789";
  const alphs = "abcdefghijklmnopqrstuvwxyz";
  if (!alphs.includes(enteredKey)) return;

  handleEncoding(enteredKey);
};

const handleKeyUp = () => {
  if (pressedInput) {
    keyGlowOff(pressedInput);
    pressedInput = null;
  }
  if (pressedOutput) {
    keyGlowOff(pressedOutput);
    pressedOutput = null;
  }
};

const handleEncoding = (enteredKey) => {
  const encInp = enigma.scrambleChar(enteredKey);
  const heads = enigma.getHeads();
  rotors.forEach((r, i) => r.value = heads[i] + 1);

  const inpRef = document.querySelector(`#inp-${enteredKey}`);
  const outRef = document.querySelector(`#out-${encInp}`);

  inputField.value += enteredKey;
  outputField.value += encInp;

  keyGlowOn(inpRef);
  keyGlowOn(outRef);

  pressedInput = inpRef;
  pressedOutput = outRef;
};

const initKeyboardEvents = () => {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
};
// Keyboard events ------------------------------------------------------

initKeyboards();
initKeyboardEvents();