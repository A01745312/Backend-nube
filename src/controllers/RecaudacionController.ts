import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import RecaudacionModel, { RecaudacionAttributes } from '../models/recaudacion';
import joi from "joi";
import {v4 as uuiv4} from 'uuid';

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
        this.router.post('/configurar', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsCreador.bind(this.permissionMiddleware), this.configurar.bind(this));
        this.router.get('/totalDonaciones', this.getTotalDonaciones.bind(this));
    }

    private async donacion(req: Request, res: Response) {
        const { nombre, cantidad } = req.body;
        try {
            const recaudacion = await RecaudacionModel.get(nombre);
            console.log(recaudacion);
            if (recaudacion) {
                const newDonationTotal = recaudacion.attrs.totalDonaciones + cantidad;
                await RecaudacionModel.update({nombre, totalDonaciones: newDonationTotal });
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
      const { nombre, proposito, meta } = req.body;
      try {
        const id = uuiv4();
        let recaudacion = await RecaudacionModel.get(nombre);
        if (!recaudacion) {
          // Si no se encuentra una recaudación existente, crear una nueva
          const newRecaudacion:RecaudacionAttributes = {
            nombre: nombre,
            totalDonaciones: 0,
            proposito: proposito,
            meta: meta,
          };
          recaudacion = await RecaudacionModel.create(newRecaudacion);
        } /* else {
          // Si se encuentra una recaudación existente, actualizar los atributos
          recaudacion.proposito = proposito;
          recaudacion.meta = meta;
          await recaudacion.save();
        } */
        res.status(200).send({ message: 'Campaña configurada con éxito.' });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al configurar la campaña.' });
      }
    }

    private async getTotalDonaciones(req: Request, res: Response) {
        const nombre = req.body;
        try {
            const recaudacion = await RecaudacionModel.get(nombre);
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
            nombre: joi.string().required(),
            totalDonaciones: joi.number().required(),
            proposito: joi.string().required(),
            meta: joi.number().required(),
        });

        const { error } = schema.validate(body);
        return !error;
    }
}

export default RecaudacionController;