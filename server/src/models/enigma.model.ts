import { Schema, model, Document } from 'mongoose';

interface IEnigmaMachine extends Document {
  rotors: string[];
  reflector: string;
  plugboard: string;
  seed: string;
  email: string;
  createdAt: Date;
}

const enigmaMachineSchema = new Schema<IEnigmaMachine>({
  rotors: { type: [String], required: true },
  reflector: { type: String, required: true },
  plugboard: { type: String, required: true },
  seed: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const EnigmaMachine = model<IEnigmaMachine>('EnigmaMachine', enigmaMachineSchema);
