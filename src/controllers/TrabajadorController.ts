import { Request, Response } from 'express';
import { WorkerService } from '../services/workerService';

class TrabajadorController {
  private static instance: TrabajadorController;

  public static getInstance(): TrabajadorController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new TrabajadorController();
    return this.instance;
  } 

  public async signup(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;
      const worker = await WorkerService.signup(username, password, email);
      res.status(201).json(worker);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async signin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const accessToken = await WorkerService.signin(username, password);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default TrabajadorController.getInstance();
