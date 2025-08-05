export interface KeyboardProps {
  type: string;
}

export interface KeyProps extends KeyboardProps {
  char: string;
}

export interface KeyPair {
  inp: null | HTMLElement;
  out: null | HTMLElement;
}

export interface Reflector {
  map: string;
}

export interface Rotor extends Reflector {
  head: number;
}