import swaggerAutogen from "swagger-autogen";
import { SwaggerUiOptions } from "swagger-ui-express";
import fs from "fs";
import path from "path";

const doc = {
  info: {
    title: "REST API Node.js / Express / TypeScript",
    version: "1.0.0",
    description: "API Docs for Products",
  },
  host: "localhost:4000",
  basePath: "/api",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Products",
      description: "API operations related to products",
    },
  ],
  definitions: {
    Product: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "The Product ID",
          example: 1,
        },
        name: {
          type: "string",
          description: "The Product name",
          example: "Monitor Curvo 49 Pulgadas",
        },
        price: {
          type: "number",
          description: "The Product price",
          example: 399,
        },
        availability: {
          type: "boolean",
          description: "The Product availability",
          example: true,
        },
      },
    },
  },
};

const outputFile = path.join(__dirname, "../../swagger-output.json");
const endpointsFiles = [path.join(__dirname, "../index.ts")];

// Generate swagger spec if it doesn't exist
if (!fs.existsSync(outputFile)) {
  swaggerAutogen()(outputFile, endpointsFiles, doc);
}

// Read the generated swagger spec
const swaggerSpec = JSON.parse(fs.readFileSync(outputFile, "utf8"));

const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
    .topbar-wrapper .link {
      content: url('https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg');
      height: 80px;
      width: auto;
    }
    .swagger-ui .topbar {
      background-color: #2b3b45;
    }
  `,
  customSiteTitle: "Documentación REST API Express / TypeScript",
  customfavIcon: `https://mouredev.com/wp-content/uploads/2018/11/mouredev_32x32.png`,
};

export default swaggerSpec;
export { swaggerUiOptions };
