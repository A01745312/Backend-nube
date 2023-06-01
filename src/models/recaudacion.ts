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
        totalDonaciones: joi.number().default(0), // Total de donaciones para la campaña
        proposito: joi.string().required(), // Propósito de la campaña
        meta: joi.number().required(), // Meta de la campaña
    },
    tableName: `Recaudacion${PREFIX_TABLE}`,
});

//Solo ejecutar la primera vez y despues comentar
/*dynamodb.createTables((err:any)=>{
    if(err) 
        return console.log('Error al crear la tabla:',err)
    console.log('Tabla creada exitosamente')
})*/

export default RecaudacionModel;
