import { Request, Response } from "express";
import { Op } from 'sequelize';
import AbstractController from "./AbstractController";
import Recaudacion from '../models/recaudacion';

class TrabajadorController extends AbstractController {
    private static instance: TrabajadorController;

    public static getInstance(): AbstractController {
        if(this.instance){
            return this.instance;
        }
        this.instance = new TrabajadorController('trabajador');
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.get('/consultar', this.authMiddleware.verifyToken, this.permissionMiddleware.handle('trabajador'), this.getConsultar.bind(this));
        this.router.get('/overhead', this.authMiddleware.verifyToken, this.permissionMiddleware.handle('trabajador'), this.getOverhead.bind(this));
    }

    private async getConsultar(req: Request, res: Response) {
        try {
            const recaudaciones = await Recaudacion.findAll();
            res.status(200).json(recaudaciones);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener las recaudaciones");
        }
    }

    private async getOverhead(req: Request, res: Response) {
        const min = parseInt(req.query.min);
        const max = parseInt(req.query.max);

        try {
            const overhead = await Recaudacion.findAll({
                where: {
                    id: {
                        [Op.between]: [min, max]
                    }
                }
            });
            res.status(200).json(overhead);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener el overhead de recaudaciones");
        }
    }

    protected validateBody(type: any) {
        throw new Error("Method not implemented");
    }

    public async generateUser(req: Request, res: Response) {
        const {email, password, attributes} = req.body;
        try {
            await this.cognitoService.signUpUser(email, password, attributes);
            res.status(201).json({message: 'Usuario creado exitosamente.'});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'No se pudo crear el usuario.'});
        }
    }
}

export default TrabajadorController;
