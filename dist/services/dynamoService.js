"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb_1 = __importDefault(require("dynamodb"));
const config_1 = require("../config");
//Configuración del servicio 
dynamodb_1.default.AWS.config.update({
    accessKeyId: config_1.AWS_ACCESS_KEY,
    secretAccessKey: config_1.AWS_SECRET_ACCESS_KEY,
    //Opcional siempre y cuando la llave tenga una politica de seguridad asociada
    sessionToken: config_1.AWS_SESSION_TOKEN,
    region: config_1.AWS_REGION
});
exports.default = dynamodb_1.default;
