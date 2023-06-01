import dynamodb from "../services/dynamoService";
import joi from "joi";
import { PREFIX_TABLE } from "../config";

export interface RecaudacionAttributes {
  id: string;
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
    id: joi.string().required(),
    nombre: joi.string().required(),
    correo: joi.string().required().email(),
    userId: joi.string().required(),
    totalDonaciones: joi.number().required(),
    proposito: joi.string().required(),
    meta: joi.number().required(),
  },
  tableName: `Recaudacion${PREFIX_TABLE}`,
});

/* dynamodb.createTables((err:any)=>{
  if(err) 
      return console.log('Error al crear la tabla:',err)
  console.log('Tabla creada exitosamente')
}) */

export default RecaudacionModel;
