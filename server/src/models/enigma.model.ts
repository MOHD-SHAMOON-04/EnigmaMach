import { Schema, model } from 'mongoose';
import type { EnigmaMachineDoc } from '../types';

const enigmaMachineSchema = new Schema<EnigmaMachineDoc>({
  rotors: { type: [String], required: true },
  reflector: { type: String, required: true },
  plugboard: { type: String, required: true },
  seed: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const EnigmaMachine = model<EnigmaMachineDoc>('EnigmaMachine', enigmaMachineSchema);
