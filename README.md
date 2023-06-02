[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/A01745312/Backend-nube)](https://github.com/A01745312/Backend-nube/issues)
[![GitHub stars](https://img.shields.io/github/stars/A01745312/Backend-nube)](https://github.com/A01745312/Backend-nube/stargazers)

# Backend-nube
## Diego Alejandro Balderas Tlahuitzo - A01745336
## Gilberto André García Gaytán - A01753176
## Paula Sophia Santoyo Arteaga - A01745312
## Ricardo Ramírez Condado - A01379299
## Paola Danae López Pérez- A01745689


Este proyecto consiste en el desarrollo de un backend para el registro y administración de apoyo a recaudaciones con un beneficio social. El backend proporciona una serie de operaciones que permiten la creación de usuarios, verificación de creadores, autenticación, donaciones a campañas y consulta de saldo.

## Características del Backend

- El backend se divide en dos controladores: uno para el manejo de los creadores y otro para el manejo de las recaudaciones.
- Las rutas relacionadas con las recaudaciones están protegidas y requieren un token de autenticación para acceder.
- Se ha generado un workspace en Postman con casos de prueba para facilitar el desarrollo y la prueba de las funcionalidades.

## Características del Despliegue

- Se debe utilizar una nueva tabla en DynamoDB o una base de datos MySQL para almacenar los datos del proyecto.
- El pool de Cognito también debe ser nuevo y se utilizará para la autenticación de los usuarios.
- En el despliegue, se puede aprovechar una instancia ya aprovisionada para alojar el proyecto.
- La demostración final se realizará utilizando una IP pública.

## Equipo de Desarrollo

Este proyecto se realizará en equipo y está destinado a ser desarrollado por un equipo de 4 personas. En caso de tener un equipo de 5 personas, se deberá agregar la funcionalidad de un trabajador social, que tendrá acceso a acciones específicas, como la consulta de datos de todas las recaudaciones, el cálculo del overhead de las recaudaciones y la protección de rutas mediante tokens y roles.


## Licencia

Este proyecto se encuentra bajo la Licencia MIT. Para más información, consulta el archivo [LICENSE](LICENSE).

El backend está desarrollado en Node.js utilizando el framework Express.js y se conecta a una base de datos en DynamoDB para almacenar y recuperar los datos de las recaudaciones.

## Configuración

Para configurar el proyecto, sigue los siguientes pasos:

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias del proyecto ejecutando el comando `npm install`.
3. Configura las variables de entorno necesarias. Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables:
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
DYNAMODB_TABLE_NAME=your_dynamodb_table_name
Asegúrate de reemplazar los valores `your_access_key_id`, `your_secret_access_key`, `your_aws_region` y `your_dynamodb_table_name` con tu propia configuración.
4. Transpilar el tsc `npm run build`.
5. Ejecuta el servidor localmente con el comando `npm run start pm`.



## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes alguna sugerencia de mejora, no dudes en abrir un issue o enviar un pull request.
