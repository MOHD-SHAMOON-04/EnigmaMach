import { Router, Request, Response } from "express";
import { EnigmaMachine } from "../models/enigma.model";
import generateEnigmaMachine from "../utils/createEnigma";
import { validEmail, validString } from "../utils/validators";
import { sendEnigmaMail } from "../services/mailer";
import rateLimit from 'express-rate-limit';

const enigmaRouter = Router();

// Rate limiting configs
const hardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const softLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
});

enigmaRouter.get('/', softLimiter, async (req: Request, res: Response) => {
  const machineId = req.query.machineId as string | undefined;

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

enigmaRouter.post('/', hardLimiter, async (req: Request, res: Response) => {
  const { seed, email } = req.body;

  if (!validString(seed) || !validEmail(email)) {
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
    const mailSent = await sendEnigmaMail(email, newMachine);
    if (mailSent) {
      res.json({ message: "Email sent successfully" });
    } else {
      return res.status(500).json({ error: "Failed to send email" });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create machine or send email" });
  }
});

export default enigmaRouter;