import { Request, Response } from 'express';
import { CreatorService } from '../services/creatorService';

class CreadorController {
  private static instance: CreadorController;

  public static getInstance(): CreadorController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new CreadorController();
    return this.instance;
  }

  public async signup(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;
      const creator = await CreatorService.signup(username, password, email);
      res.status(201).json(creator);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async verify(req: Request, res: Response) {
    try {
      const { verificationCode } = req.body;
      const result = await CreatorService.verify(verificationCode);
      res.status(200).json({ success: result });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async signin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const accessToken = await CreatorService.signin(username, password);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default CreadorController.getInstance();
