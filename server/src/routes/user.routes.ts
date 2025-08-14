import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { validEmail, validPassword } from "../utils/validators";
import { hashPassword, getSalt } from "../utils/cryptoUtils";

const userRouter = Router();
userRouter.use(validatorMiddleware);

userRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const hashedPassword = hashPassword(password as string, user.salt, 5);

    if (user.password === hashedPassword) {
      // also return a token here
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

userRouter.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ error: "User already exists" });
    }

    const salt = getSalt();
    const hashedPassword = hashPassword(password as string, salt, 5);

    const newUser = new User({ email, password: hashedPassword, salt });
    await newUser.save();

    // also return a token here
    return res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

function validatorMiddleware(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!validEmail(email) || !validPassword(password)) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  next();
};

export default userRouter;