import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import RecaudacionModel from "../models/recaudacion";

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
      let recaudacion = await RecaudacionModel.get(id);
      if (recaudacion) {
        recaudacion += cantidad;
        await recaudacion.save();
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
      let recaudacion = await RecaudacionModel.get(id);
      if (recaudacion) {
        recaudacion = proposito;
        recaudacion = meta;
        await recaudacion.save();
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
      let recaudacion = await RecaudacionModel.get(id);
      if (recaudacion) {
        res.status(200).send({ totalDonaciones: recaudacion });
      } else {
        res.status(404).send({ message: 'La recaudación no existe.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener el total de donaciones.' });
    }
  }

  protected validateBody(type: any): void {
    // Asegúrate de que el objeto type contenga todas las propiedades necesarias
    if (!type || typeof type !== 'object') {
      throw new Error('El cuerpo de la solicitud no puede estar vacío');
    }

    const { id, cantidad, proposito, meta } = type;

    if (typeof id !== 'string' || id.trim() === '') {
      throw new Error('El campo "id" es requerido y debe ser una cadena no vacía');
    }

    if (typeof cantidad !== 'number' || isNaN(cantidad) || cantidad <= 0) {
      throw new Error('El campo "cantidad" es requerido y debe ser un número positivo');
    }

    if (typeof proposito !== 'string' || proposito.trim() === '') {
      throw new Error('El campo "proposito" es requerido y debe ser una cadena no vacía');
    }

    if (typeof meta !== 'number' || isNaN(meta) || meta <= 0) {
      throw new Error('El campo "meta" es requerido y debe ser un número positivo');
    }
  }
}

export default RecaudacionController;

