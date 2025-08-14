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

export interface User {
  email: string;
  password: string;
  salt: string;
  createdAt: Date;
}

export interface UserDoc extends Document, User {
}