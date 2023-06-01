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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractController_1 = __importDefault(require("./AbstractController"));
const userNOSQL_1 = __importDefault(require("../models/userNOSQL"));
const recaudacion_1 = __importDefault(require("../models/recaudacion"));
class TrabajadorController extends AbstractController_1.default {
    static getInstance() {
        if (!this.instance) {
            this.instance = new TrabajadorController("trabajador");
        }
        return this.instance;
    }
    initRoutes() {
        this.router.post('/generateUser', this.generateUser.bind(this));
        this.router.get('/consultar', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.getConsultar.bind(this));
        this.router.get('/overhead', this.authMiddleware.verifyToken.bind(this.authMiddleware), this.permissionMiddleware.checkIsTrabajador.bind(this.permissionMiddleware), this.getOverhead.bind(this));
    }
    generateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name } = req.body;
            try {
                const user = yield this.cognitoService.signUpUser(email, password, [
                    {
                        Name: 'email',
                        Value: email,
                    },
                ]);
                yield userNOSQL_1.default.create({
                    awsCognitoId: user.UserSub,
                    name,
                    role: 'TRABAJADOR',
                    email,
                }, {
                    overwrite: false,
                });
                res.status(201).send({ message: 'Trabajador creado exitosamente.' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'No se pudo crear el trabajador.' });
            }
        });
    }
    getConsultar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recaudaciones = yield recaudacion_1.default.scan().exec();
                res.status(200).json(recaudaciones);
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Error al obtener las recaudaciones");
            }
        });
    }
    getOverhead(req, res) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const min = parseInt(req.query.min);
            const max = parseInt(req.query.max);
            try {
                const recaudaciones = yield recaudacion_1.default.scan().exec();
                const overhead = [];
                try {
                    for (var _d = true, recaudaciones_1 = __asyncValues(recaudaciones), recaudaciones_1_1; recaudaciones_1_1 = yield recaudaciones_1.next(), _a = recaudaciones_1_1.done, !_a;) {
                        _c = recaudaciones_1_1.value;
                        _d = false;
                        try {
                            const rec = _c;
                            if (rec.id >= min && rec.id <= max) {
                                overhead.push(rec);
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = recaudaciones_1.return)) yield _b.call(recaudaciones_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                res.status(200).json(overhead);
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Error al obtener el overhead de recaudaciones");
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
