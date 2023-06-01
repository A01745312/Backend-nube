"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamoService_1 = __importDefault(require("../services/dynamoService"));
const joi_1 = __importDefault(require("joi"));
const config_1 = require("../config");
const RecaudacionModel = dynamoService_1.default.define("recaudacion", {
    hashKey: "nombre",
    timestamps: true,
    schema: {
        nombre: joi_1.default.string().required(),
        totalDonaciones: joi_1.default.number().required(),
        proposito: joi_1.default.string().required(),
        meta: joi_1.default.number().required(),
    },
    tableName: `Recaudacion${config_1.PREFIX_TABLE}`,
});
dynamoService_1.default.createTables((err) => {
    if (err)
        return console.log('Error al crear la tabla:', err);
    console.log('Tabla creada exitosamente');
});
exports.default = RecaudacionModel;
