import mysql from 'mysql2/promise';

// Configuración de conexión a la base de datos
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

// Función para obtener una conexión a la base de datos
const getConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

// Ejemplo de consulta a la base de datos
const getUsers = async () => {
  const connection = await getConnection();
  const [rows] = await connection.execute('SELECT * FROM users');
  connection.end();

  return rows;
};

export { getConnection, getUsers };