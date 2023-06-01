import { Response, Request, NextFunction } from 'express';
import UserModel, { UserRoles } from '../models/users';

export default class PermissionMiddleware {
  // Singleton
  private static instance: PermissionMiddleware;

  public static getInstance(): PermissionMiddleware {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new PermissionMiddleware();
    return this.instance;
  }

  /**
   * Verify that the current user is a worker (trabajador)
   */
  public async checkIsTrabajador(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserModel.findByPk(req.user);
      if (user && user.role === UserRoles.TRABAJADORES) {
        next();
      } else {
        res.status(401).send({ code: 'UserNotTrabajadorException', message: 'The logged account is not a worker' });
      }
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }

  /**
   * Verify that the current user is a creator (creador)
   */
  public async checkIsCreador(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserModel.findByPk(req.user);
      if (user && user.role === UserRoles.CREADOR) {
        next();
      } else {
        res.status(401).send({ code: 'UserNotCreadorException', message: 'The logged account is not a creator' });
      }
    } catch (error: any) {
      res.status(500).send({ code: error.code, message: error.message });
    }
  }
}
