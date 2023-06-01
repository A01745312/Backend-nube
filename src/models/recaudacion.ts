import dynamodb from "../services/dynamoService";
import joi from "joi";
import { PREFIX_TABLE } from "../config";

const RecaudacionModel = dynamodb.define("recaudacion", {
    hashKey: "id",
    timestamps: true,
    schema: {
        id: joi.number().required(),
        nombre: joi.string().required(),
        correo: joi.string().required().email(),
        userId: joi.string().required(), // Para referencia al usuario
    },
    tableName: `Recaudacion${PREFIX_TABLE}`,
});


export default RecaudacionModel;
