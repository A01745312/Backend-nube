import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import UserModel from "../models/userNOSQL";
import RecaudacionModel, { RecaudacionAttributes } from "../models/recaudacion";
const toArray = require('stream-to-array');


class TrabajadorController extends AbstractController {
  private static instance: TrabajadorController;

  public static getInstance(): AbstractController {
    if (!this.instance) {
      this.instance = new TrabajadorController("trabajador");
    }
    return this.instance;
  }

  protected initRoutes(): void {
    this.router.get('/consultar', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.consultar.bind(this));
    this.router.get('/overhead', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.overhead.bind(this));
  }
  
  private async consultar(req: Request, res: Response): Promise<void> {
    try {
      const recaudaciones: RecaudacionAttributes[] = await RecaudacionModel.scan().exec().promise() as unknown as RecaudacionAttributes[];
      res.status(200).json({
        status: "Success",
        recaudaciones: recaudaciones
      });
    } catch (error: any) {
      res.status(500).json({ code: error.code, message: error.message });
    }
  }
  

  private async overhead(req: Request, res: Response): Promise<void> {
    try {
      const stream = await RecaudacionModel.scan().exec();
      const data = await toArray(stream); // convierte stream a matriz
  
      console.log('Data:', data); // Imprime data
  
      // Asegurémonos de que data es un array y que el primer elemento tiene la propiedad Items
      if (Array.isArray(data) && data.length > 0 && data[0].Items) {
        const recaudaciones = data[0].Items;
  
        console.log('Recaudaciones:', recaudaciones); // Imprime recaudaciones
  
        const overhead = recaudaciones.map((recaudacion: any) => {
          return {
            nombre: recaudacion.attrs.nombre,
            overhead: Math.abs(recaudacion.attrs.totalDonaciones - recaudacion.attrs.meta)
          };
        });
  
        res.status(200).json({
          status: "Success",
          recaudaciones: overhead
        });
      } else {
        // Si data no tiene la forma que esperamos, imprime un error y devuelve una respuesta vacía
        console.error('Data no tiene la forma esperada:', data);
        res.status(200).json({
          status: "Success",
          recaudaciones: []
        });
      }
    } catch (error: any) {
      res.status(500).json({ code: error.code, message: error.message });
    }
  }
  
  
  
  
  protected validateBody(type: any) {
    if (!type || Object.keys(type).length === 0) {
      throw new Error("The request body cannot be empty");
    }
  }
}

export default TrabajadorController;
