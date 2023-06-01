import dynamodb from 'dynamodb';

import {AWS_ACCESS_KEY,AWS_SECRET_ACCESS_KEY,AWS_SESSION_TOKEN,AWS_REGION } from '../config';

//Configuración del servicio 
dynamodb.AWS.config.update({
    accessKeyId:AWS_ACCESS_KEY,
    secretAccessKey:AWS_SECRET_ACCESS_KEY,
    //Opcional siempre y cuando la llave tenga una politica de seguridad asociada
    sessionToken:AWS_SESSION_TOKEN,
    region:AWS_REGION
});

export default dynamodb;