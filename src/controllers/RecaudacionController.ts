import { Request, Response } from 'express';
import { CampaignService } from '../services/campaignService';

export const configure = async (req: Request, res: Response) => {
  try {
    const { campaignId, purpose, goal } = req.body;
    const result = await CampaignService.configure(campaignId, purpose, goal);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
