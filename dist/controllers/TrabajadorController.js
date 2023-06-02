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
                const response = yield recaudacion_1.default.scan().exec().promise();
                if (!response || !response.Items) {
                    throw new Error('No hay recaudaciones válidas');
                }
                const recaudaciones = response.Items;
                console.log('Recaudaciones:', recaudaciones);
                const validRecaudaciones = recaudaciones.filter((recaudacion) => {
                    const isValidMeta = Number.isInteger(recaudacion.meta);
                    const isValidDonaciones = recaudacion.totalDonaciones !== 0;
                    return isValidMeta && isValidDonaciones;
                });
                console.log('Recaudaciones válidas:', validRecaudaciones);
                if (validRecaudaciones.length === 0) {
                    throw new Error('No hay recaudaciones válidas');
                }
                const overheadList = validRecaudaciones.map(recaudacion => {
                    return {
                        nombre: recaudacion.nombre,
                        totalDonativo: recaudacion.totalDonaciones,
                        meta: recaudacion.meta,
                        overhead: recaudacion.totalDonaciones - recaudacion.meta
                    };
                });
                console.log('Lista de overhead:', overheadList);
                const overheadMin = Math.min(...overheadList.map(item => item.overhead));
                const overheadMax = Math.max(...overheadList.map(item => item.overhead));
                console.log('Overhead mínimo:', overheadMin);
                console.log('Overhead máximo:', overheadMax);
                res.status(200).json({
                    status: "Success",
                    overheadMin: overheadMin,
                    overheadMax: overheadMax,
                });
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
