import dynamodb from "../services/dynamoService";
import joi from "joi";
import { PREFIX_TABLE } from "../config";

interface RecaudacionAttributes {
  id: number;
  nombre: string;
  correo: string;
  userId: string;
  totalDonaciones: number;
  proposito: string;
  meta: number;
}

const RecaudacionModel = dynamodb.define<RecaudacionAttributes>("recaudacion", {
  hashKey: "id",
  timestamps: true,
  schema: {
    id: joi.number().required(),
    nombre: joi.string().required(),
    correo: joi.string().required().email(),
    userId: joi.string().required(),
    totalDonaciones: joi.number().required(),
    proposito: joi.string().required(),
    meta: joi.number().required(),
  },
  tableName: `Recaudacion${PREFIX_TABLE}`,
});

export default RecaudacionModel;
