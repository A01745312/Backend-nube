import { Request, Response } from 'express';
import { WorkerService } from '../services/auth/workerService';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const worker = await WorkerService.signup(username, password, email);
    return res.status(201).json(worker);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const tokens = await WorkerService.signin(username, password);
    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
