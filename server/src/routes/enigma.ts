import { Router, Request, Response } from "express";
import { EnigmaMachine } from "../models/enigma.model";
import generateEnigmaMachine from "../utils/createEnigma";
import sendNewEnigmaMail from "../services/sendEmail";

const enigmaRouter = Router();
const validEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return regex.test(email);
}

enigmaRouter.get('/', async (req: Request, res: Response) => {
  const { machineId } = req.query;

  if (machineId && typeof machineId === 'string') {
    try {
      const existingMachine = await EnigmaMachine.findById(machineId);

      if (existingMachine) {
        return res.json({
          rotors: existingMachine.rotors,
          reflector: existingMachine.reflector,
          plugboard: existingMachine.plugboard
        });
      } else {
        return res.status(404).json({ error: "Machine not found" });
      }

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(400).json({ error: "machineId must be provided" });
});

enigmaRouter.post('/', async (req: Request, res: Response) => {
  const { seed, email } = req.body;

  if (
    !seed ||
    !email ||
    typeof seed !== 'string' ||
    typeof email !== 'string' ||
    !validEmail(email)
  ) {
    return res.status(400).json({ error: "Both seed and email must be valid" });
  }

  try {
    const newSeed = seed + '_' + email;
    // Check if machine already exists
    const existingMachine = await EnigmaMachine.findOne({ seed: newSeed });
    if (existingMachine) {
      return res.status(400).json({ error: "Machine with this seed already exists" });
    }

    // Generate new machine
    const machineConfig = generateEnigmaMachine(newSeed);
    const newMachine = new EnigmaMachine({
      ...machineConfig,
      email
    });

    await newMachine.save();

    // send mail here
    const success = await sendNewEnigmaMail(email, newMachine);
    if (success)
      res.json({ message: "Check your email to get your new machine" });
    else
      res.status(500).json({ error: "Failed to send email" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create machine or send email" });
  }
});

export default enigmaRouter;