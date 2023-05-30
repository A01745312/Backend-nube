import { Request, Response } from 'express';
import { CreatorService } from '../services/auth/creatorService';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const creator = await CreatorService.signup(username, password, email);
    return res.status(201).json(creator);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { verificationCode } = req.body;
    const result = await CreatorService.verify(verificationCode);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const tokens = await CreatorService.signin(username, password);
    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
