import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import UserModel from "../models/userNOSQL";
import RecaudacionModel, { RecaudacionAttributes } from "../models/recaudacion";

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
      const recaudaciones: RecaudacionAttributes[] = await RecaudacionModel.scan().exec().promise() as unknown as RecaudacionAttributes[];
      const overhead = recaudaciones.map((recaudacion: RecaudacionAttributes) => {
        return {
          nombre: recaudacion.nombre,
          overhead: recaudacion.totalDonaciones - recaudacion.meta
        };
      });
      res.status(200).json({
        status: "Success",
        recaudaciones: overhead
      });
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

