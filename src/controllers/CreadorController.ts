import { Request, Response } from "express";
import AbstractController from "./AbstractController";
import UserModel from "../models/userNOSQL";

class CreadorController extends AbstractController {
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }

    //Singleton
    private static instance: CreadorController;
    public static getInstance(): AbstractController {
        //si existe la instancia la regreso
        if (this.instance) {
            return this.instance;
        }
        //si no exite la creo
        this.instance = new CreadorController("creador");
        return this.instance;
    }

    //Configurar las rutas del controlador
    protected initRoutes(): void {
        this.router.post("/signup", this.signUp.bind(this));
        this.router.post("/signin", this.signIn.bind(this));
        this.router.post("/verificar", this.verify.bind(this));
    }

    private async signUp(req: Request, res: Response) {
        const { email, password, name, role } = req.body;
        try {
            //Create el usuario de cognito
            const user = await this.cognitoService.signUpUser(email, password, [
                {
                    Name: "email",
                    Value: email,
                },
            ]);
            console.log("cognito user created", user);
            //Creación del usuario dentro de la BDNoSQL-DynamoDB
            await UserModel.create(
                {
                    awsCognitoId: user.UserSub,
                    name,
                    role,
                    email,
                },
                { overwrite: false }
            );
            res.status(201).send({ message: "User signedUp" });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async signIn(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const login = await this.cognitoService.signInUser(email, password);
            res.status(200).send({ ...login.AuthenticationResult });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async verify(req: Request, res: Response) {
        const { email, code } = req.body;
        try {
            await this.cognitoService.verifyUser(email, code);
            return res.status(200).send({ message: "Correct verification" });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }
}

export default CreadorController;
