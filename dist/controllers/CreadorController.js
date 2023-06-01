"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("./AbstractController"));
const userNOSQL_1 = __importDefault(require("../models/userNOSQL"));
class CreadorController extends AbstractController_1.default {
    validateBody(type) {
        throw new Error("Method not implemented.");
    }
    static getInstance() {
        //si existe la instancia la regreso
        if (this.instance) {
            return this.instance;
        }
        //si no exite la creo
        this.instance = new CreadorController("creador");
        return this.instance;
    }
    //Configurar las rutas del controlador
    initRoutes() {
        this.router.post("/signup", this.signUp.bind(this));
        this.router.post("/signin", this.signIn.bind(this));
        this.router.post("/verificar", this.verify.bind(this));
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name, role } = req.body;
            try {
                //Create el usuario de cognito
                const user = yield this.cognitoService.signUpUser(email, password, [
                    {
                        Name: "email",
                        Value: email,
                    },
                ]);
                console.log("cognito user created", user);
                //Creación del usuario dentro de la BDNoSQL-DynamoDB
                yield userNOSQL_1.default.create({
                    awsCognitoId: user.UserSub,
                    name,
                    role,
                    email,
                }, { overwrite: false });
                res.status(201).send({ message: "User signedUp" });
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const login = yield this.cognitoService.signInUser(email, password);
                res.status(200).send(Object.assign({}, login.AuthenticationResult));
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, code } = req.body;
            try {
                yield this.cognitoService.verifyUser(email, code);
                return res.status(200).send({ message: "Correct verification" });
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
            }
        });
    }
}
exports.default = CreadorController;
