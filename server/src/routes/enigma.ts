import { Router, Request, Response } from "express";
import { EnigmaMachine } from "../models/enigma.model";
import generateEnigmaMachine from "../utils/createEnigma";
// import { transporter } from "../services/transporter";

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

    // // Generate share links
    // const shareLink = `${process.env.BASE_URL}/enigma?seedId=${newMachine.machineId}`;

    // // Send email
    // await transporter.sendMail({
    //   from: `"Enigma Machine" <${process.env.EMAIL_FROM}>`,
    //   to: email,
    //   subject: 'Your New Enigma Machine Configuration',
    //   html: `
    //             <h1>Your Enigma Machine</h1>
    //             <p>Here's your personalized Enigma machine configuration:</p>

    //             <h2>Share Links</h2>
    //             <p><a href="${shareLink}">Direct Link</a></p>
    //             <p>Machine ID: ${newMachine.machineId}</p>

    //             <h2>Configuration</h2>
    //             <p><strong>Rotors:</strong></p>
    //             <ul>
    //                 ${newMachine.rotors.map(r => `<li>${r}</li>`).join('')}
    //             </ul>
    //             <p><strong>Reflector:</strong> ${newMachine.reflector}</p>
    //             <p><strong>Plugboard:</strong> ${newMachine.plugboard}</p>

    //             <p>This machine was created on ${newMachine.createdAt.toLocaleString()}</p>
    //         `
    // });

    // res.json({ message: "Check your email to get your new machine" });
    res.json(newMachine);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create machine or send email" });
  }
});

export default enigmaRouter;