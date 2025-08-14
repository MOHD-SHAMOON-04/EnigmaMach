export interface KeyboardProps {
  type: 'out' | 'inp';
  onPointerDown?: (e: React.PointerEvent<Element>) => void;
  onPointerUp?: (e: React.PointerEvent<Element>) => void;
}

export interface KeyProps extends KeyboardProps {
  char: string;
}

export interface Reflector {
  map: string;
}

export interface Rotor extends Reflector {
  head: number;
}

export interface Plugboard extends Reflector {
  default: string;
}

export interface initDefault {
  rotors: string[];
  reflector: string;
  plugboard: string;
}

export type CharMap = Map<string, string>;

export interface UseRefMap {
  inp: HTMLElement | null;
  out: HTMLElement | null;
  key: string | null;
}