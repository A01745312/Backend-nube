import { Request, Response } from 'express';
import { CampaignService } from '../services/campaignService';

class RecaudacionController {
  private static instance: RecaudacionController;

  public static getInstance(): RecaudacionController {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new RecaudacionController();
    return this.instance;
  }

  public async configure(req: Request, res: Response) {
    try {
      const { campaignId, purpose, goal } = req.body;
      const campaign = await CampaignService.configure(campaignId, purpose, goal);
      res.status(200).json(campaign);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default RecaudacionController.getInstance();
