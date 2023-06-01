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
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
class RecaudacionController extends AbstractController_1.default {
    static getInstance() {
        if (!this.instance) {
            this.instance = new RecaudacionController("recaudacion");
        }
        return this.instance;
    }
    initRoutes() {
        this.router.post('/donacion', this.donacion.bind(this));
        this.router.post('/configurar', this.configurar.bind(this));
        this.router.get('/totalDonaciones', this.getTotalDonaciones.bind(this));
    }
    donacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, cantidad } = req.body;
            try {
                const recaudacion = yield recaudacion_1.default.get(nombre);
                console.log(recaudacion);
                if (recaudacion) {
                    const newDonationTotal = recaudacion.attrs.totalDonaciones + cantidad;
                    yield recaudacion_1.default.update({ nombre, totalDonaciones: newDonationTotal });
                    res.status(200).send({ message: 'Donación realizada con éxito.' });
                }
                else {
                    res.status(404).send({ message: 'La recaudación no existe.' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Error al realizar la donación.' });
            }
        });
    }
    configurar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, proposito, meta } = req.body;
            try {
                const id = (0, uuid_1.v4)();
                let recaudacion = yield recaudacion_1.default.get(nombre);
                if (!recaudacion) {
                    // Si no se encuentra una recaudación existente, crear una nueva
                    const newRecaudacion = {
                        nombre: nombre,
                        totalDonaciones: 0,
                        proposito: proposito,
                        meta: meta,
                    };
                    recaudacion = yield recaudacion_1.default.create(newRecaudacion);
                } /* else {
                  // Si se encuentra una recaudación existente, actualizar los atributos
                  recaudacion.proposito = proposito;
                  recaudacion.meta = meta;
                  await recaudacion.save();
                } */
                res.status(200).send({ message: 'Campaña configurada con éxito.' });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Error al configurar la campaña.' });
            }
        });
    }
    getTotalDonaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombre = req.body;
            try {
                const recaudacion = yield recaudacion_1.default.get(nombre);
                if (recaudacion) {
                    res.status(200).send({ totalDonaciones: recaudacion.attrs.totalDonaciones });
                }
                else {
                    res.status(404).send({ message: 'La recaudación no existe.' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).send({ message: 'Error al obtener el total de donaciones.' });
            }
        });
    }
    validateBody(body) {
        const schema = joi_1.default.object({
            nombre: joi_1.default.string().required(),
            totalDonaciones: joi_1.default.number().required(),
            proposito: joi_1.default.string().required(),
            meta: joi_1.default.number().required(),
        });
        const { error } = schema.validate(body);
        return !error;
    }
}
exports.default = RecaudacionController;
