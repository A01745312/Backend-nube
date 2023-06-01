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
const streamToArray = require("stream-to-array");
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
                const recaudacionesResult = yield streamToArray(recaudacion_1.default.scan().exec());
                console.log("Recaudaciones Result:", recaudacionesResult);
                const items = recaudacionesResult[0].Items;
                const recaudaciones = items.map((item) => item.attrs);
                let minOverhead = recaudaciones.length > 0 ? recaudaciones[0].totalDonaciones - recaudaciones[0].meta : null;
                let maxOverhead = minOverhead;
                // Calculate the minimum and maximum overhead
                for (const recaudacion of recaudaciones) {
                    const overhead = recaudacion.totalDonaciones - recaudacion.meta;
                    if (minOverhead === null || overhead < minOverhead) {
                        minOverhead = overhead;
                    }
                    if (maxOverhead === null || overhead > maxOverhead) {
                        maxOverhead = overhead;
                    }
                }
                res.status(200).send({
                    status: "Success",
                    recaudaciones: {
                        minOverhead,
                        maxOverhead,
                    },
                });
                return;
            }
            catch (error) {
                res.status(500).send({ code: error.code, message: error.message });
                return;
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
