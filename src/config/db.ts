import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno desde .env

const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + "/../models/**/*"], // Carga automáticamente todos los modelos de la carpeta models
  logging: false,
});

export default db;
