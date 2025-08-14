import { Document } from "mongoose";

export interface EnigmaMachine {
  rotors: string[];
  reflector: string;
  plugboard: string;
  seed: string;
}

export interface EnigmaMachineDoc extends Document, EnigmaMachine {
  email: string;
  createdAt: Date;
}