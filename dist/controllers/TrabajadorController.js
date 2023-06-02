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
const recaudacion_1 = __importDefault(require("../models/recaudacion"));
const toArray = require('stream-to-array');
class TrabajadorController extends AbstractController_1.default {
    static getInstance() {
        if (!this.instance) {
            this.instance = new TrabajadorController("trabajador");
        }
        return this.instance;
    }
    initRoutes() {
        this.router.get('/consultar', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.consultar.bind(this));
        this.router.get('/overhead', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.overhead.bind(this));
    }
    consultar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recaudaciones = yield recaudacion_1.default.scan().exec().promise();
                res.status(200).json({
                    status: "Success",
                    recaudaciones: recaudaciones
                });
            }
            catch (error) {
                res.status(500).json({ code: error.code, message: error.message });
            }
        });
    }
    overhead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stream = yield recaudacion_1.default.scan().exec();
                const data = yield toArray(stream); // convierte stream a matriz
                console.log('Data:', data); // Imprime data
                // Asegurémonos de que data es un array y que el primer elemento tiene la propiedad Items
                if (Array.isArray(data) && data.length > 0 && data[0].Items) {
                    const recaudaciones = data[0].Items;
                    console.log('Recaudaciones:', recaudaciones); // Imprime recaudaciones
                    const overhead = recaudaciones.map((recaudacion) => {
                        return {
                            nombre: recaudacion.attrs.nombre,
                            overhead: Math.abs(recaudacion.attrs.totalDonaciones - recaudacion.attrs.meta)
                        };
                    });
                    res.status(200).json({
                        status: "Success",
                        recaudaciones: overhead
                    });
                }
                else {
                    // Si data no tiene la forma que esperamos, imprime un error y devuelve una respuesta vacía
                    console.error('Data no tiene la forma esperada:', data);
                    res.status(200).json({
                        status: "Success",
                        recaudaciones: []
                    });
                }
            }
            catch (error) {
                res.status(500).json({ code: error.code, message: error.message });
            }
        });
    }
    validateBody(type) {
        if (!type || Object.keys(type).length === 0) {
            throw new Error("The request body cannot be empty");
        }
    }
}
exports.default = TrabajadorController;
