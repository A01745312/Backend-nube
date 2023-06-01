import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import RecaudacionModel from '../models/recaudacion';
import joi from "joi";

class RecaudacionController extends AbstractController {
  private static instance: RecaudacionController;

  public static getInstance(): AbstractController {
    if (!this.instance) {
      this.instance = new RecaudacionController("recaudacion");
    }
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.post('/donacion', this.donacion.bind(this));
    this.router.post('/configurar', this.configurar.bind(this));
    this.router.get('/totalDonaciones/:id', this.getTotalDonaciones.bind(this));
  }

  private async donacion(req: Request, res: Response) {
    const { id, cantidad } = req.body;
    try {
      const recaudacion = await RecaudacionModel.get(id);
      if (recaudacion) {
        const newDonationTotal = recaudacion.attrs.totalDonaciones + cantidad;
        await RecaudacionModel.update({ id, totalDonaciones: newDonationTotal });
        res.status(200).send({ message: 'Donación realizada con éxito.' });
      } else {
        res.status(404).send({ message: 'La recaudación no existe.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al realizar la donación.' });
    }
  }

  private async configurar(req: Request, res: Response) {
    const { id, proposito, meta } = req.body;
    try {
      const recaudacion = await RecaudacionModel.get(id);
      if (recaudacion) {
        await RecaudacionModel.update({ id, proposito, meta });
        res.status(200).send({ message: 'Campaña configurada con éxito.' });
      } else {
        res.status(404).send({ message: 'La recaudación no existe.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al configurar la campaña.' });
    }
  }
  
  private async getTotalDonaciones(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const recaudacion = await RecaudacionModel.get(id);
      if (recaudacion) {
        res.status(200).send({ totalDonaciones: recaudacion.attrs.totalDonaciones });
      } else {
        res.status(404).send({ message: 'La recaudación no existe.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener el total de donaciones.' });
    }
  }
  

  protected validateBody(body: any): boolean {
    const schema = joi.object({
      id: joi.string().required(),
      nombre: joi.string().required(),
      correo: joi.string().required().email(),
      userId: joi.string().required(),
      totalDonaciones: joi.number().required(),
      proposito: joi.string().required(),
      meta: joi.number().required(),
    });
  
    const { error } = schema.validate(body);
    return !error;
  }
}

export default RecaudacionController;
