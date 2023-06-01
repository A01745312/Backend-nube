import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import UserModel from "../models/userNOSQL";
import RecaudacionModel, { RecaudacionAttributes } from "../models/recaudacion";
import streamToArray = require('stream-to-array');


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
      const recaudacionesResult = await streamToArray(RecaudacionModel.scan().exec());
      console.log("Recaudaciones Result:", recaudacionesResult);
  
      const items = recaudacionesResult[0].Items;
      const recaudaciones: RecaudacionAttributes[] = items.map((item: any) => item.attrs);
  
      let minOverhead: number | null = recaudaciones.length > 0 ? recaudaciones[0].totalDonaciones - recaudaciones[0].meta : null;
      let maxOverhead: number | null = minOverhead;
  
      // Calculate the minimum and maximum overhead
      for (const recaudacion of recaudaciones) {
        const overhead = recaudacion.totalDonaciones - recaudacion.meta;
        if (overhead > maxOverhead!) {
          maxOverhead = overhead;
        }
        if (overhead < minOverhead!) {
          minOverhead = overhead;
        }
      }
  
      // Convert negative overhead values to positive
      minOverhead = minOverhead !== null ? Math.abs(minOverhead) : null;
      maxOverhead = maxOverhead !== null ? Math.abs(maxOverhead) : null;
  
      res.status(200).send({
        status: "Success",
        recaudaciones: {
          minOverhead,
          maxOverhead,
        },
      });
  
      return;
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
      return;
    }
  }
  
  
  
  protected validateBody(type: any) {
    if (!type || Object.keys(type).length === 0) {
      throw new Error("The request body cannot be empty");
    }
  }
}

export default TrabajadorController;
