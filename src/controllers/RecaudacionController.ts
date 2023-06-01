import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import RecaudacionModel from "../models/recaudacion";

class RecaudacionController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }

    protected initRoutes(): void {
        this.router.post('/donacion', this.donacion.bind(this));
        this.router.post('/configurar', this.configurar.bind(this));
        this.router.get('/totalDonaciones', this.getTotalDonaciones.bind(this));
    }

    private async donacion(req: Request, res: Response) {
        const { id, cantidad } = req.body;
        try {
            let recaudacion = await RecaudacionModel.get(id);
            recaudacion.totalDonaciones += cantidad;
            await recaudacion.save();
            res.status(200).send({ message: 'Donación realizada con éxito.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al realizar la donación.' });
        }
    }

    private async configurar(req: Request, res: Response) {
        const { id, proposito, meta } = req.body;
        try {
            let recaudacion = await RecaudacionModel.get(id);
            recaudacion.proposito = proposito;
            recaudacion.meta = meta;
            await recaudacion.save();
            res.status(200).send({ message: 'Campaña configurada con éxito.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al configurar la campaña.' });
        }
    }

    private async getTotalDonaciones(req: Request, res: Response) {
        const id = req.params.id;
        try {
            let recaudacion = await RecaudacionModel.get(id);
            res.status(200).send({ totalDonaciones: recaudacion.totalDonaciones });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error al obtener el total de donaciones.' });
        }
    }
}

export default RecaudacionController;

