import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

// Conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate(); // Verifica la conexión con la base de datos
    await db.sync(); // Sincroniza los modelos con la BD
    // console.log(colors.blue("✅ Conexión exitosa a la BD")); // Comentar esta línea al realizar tests
  } catch (e) {
    console.log(colors.red.bold("❌ Hubo un error al conectar a la BD"));
  }
}

// Ejecutamos la conexión antes de arrancar el servidor
(async () => {
  await connectDB();
})();

// Crear el Server - Instancia de express
const server = express();

// Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};
server.use(cors(corsOptions));

// Recibir y procesar datos en formato JSON en las solicitudes
server.use(express.json());

server.use(morgan("dev"));
server.use("/api/products", router); // Adjuntar rutas

// Docs
server.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUiOptions),
);

export default server;
