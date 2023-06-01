import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import db from '../models/userNOSQL';

class TrabajadorController extends AbstractController {
    private static instance: TrabajadorController;

    public static getInstance(): AbstractController {
        if(!this.instance){
            this.instance = new TrabajadorController("trabajador");
        }
        return this.instance;
    }
    

    protected initRoutes(): void {
        this.router.post('/generateUser', this.generateUser.bind(this));
        this.router.get('/consultar', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.getConsultar.bind(this));
        this.router.get('/overhead', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.getOverhead.bind(this));
    }

    public async generateUser(req: Request, res: Response) {
        const { email, password, name } = req.body;
        try {
            const user = await this.cognitoService.signUpUser(email, password, [
                {
                    Name: 'email',
                    Value: email,
                },
            ]);

            await db.UserModel.create({
                awsCognitoId: user.UserSub,
                name,
                role: 'TRABAJADOR',
                email,
            }, {
                overwrite: false,
            });

            res.status(201).send({ message: 'Trabajador creado exitosamente.' });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'No se pudo crear el trabajador.' });
        }
    }

    private async getConsultar(req: Request, res: Response) {
        try {
            const recaudaciones = await db.Recaudacion.scan().exec();
            res.status(200).json(recaudaciones);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener las recaudaciones");
        }
    }
    
    private async getOverhead(req: Request, res: Response) {
        const min = parseInt(req.query.min as string);
        const max = parseInt(req.query.max as string);
    
        try {
            const recaudaciones = await db.Recaudacion.scan().exec();
            const overhead = recaudaciones.filter(
                (rec: { id: number }) => rec.id >= min && rec.id <= max
            );
            res.status(200).json(overhead);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener el overhead de recaudaciones");
        }
    }
    
    protected validateBody(type: any) {
        // A simple validation function that checks if the body is empty
        if (!type || Object.keys(type).length === 0) {
            throw new Error("The request body cannot be empty");
        }
    }
}

export default TrabajadorController;
