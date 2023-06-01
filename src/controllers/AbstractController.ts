import { Router } from 'express';
import db from '../models/index';
import AuthMiddleware from '../middlewares/authorization';
import PermissionMiddleware from '../middlewares/permission';
import ValidationErrorMiddleware from '../middlewares/validationError';
import CognitoService from '../services/cognitoService';

export default abstract class AbstractController{
    protected _router: Router = Router();
    protected _prefix: string;

    // Import the database models
    protected db = db;

    protected handleErrors = ValidationErrorMiddleware.handleErrors;
    protected authMiddleware = AuthMiddleware.getInstance();
    protected permissionMiddleware = PermissionMiddleware.getInstance();
    protected cognitoService = CognitoService.getInstance();

    public get prefix(): string{
        return this._prefix;
    }

    public get router(): Router{
        return this._router;
    }

    protected constructor(prefix: string){
        this._prefix = prefix;
        this.initRoutes();
    }

    // Initialize routes
    protected abstract initRoutes(): void;
    // Validate the request body
    protected abstract validateBody(type: any): any;
}
