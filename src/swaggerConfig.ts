import dotenv from "dotenv";
dotenv.config();
import swaggerJsdoc from "swagger-jsdoc";
import { loger } from "./components/logger";
import path from "path";

const option: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentation Itirena Backend",
      version: "1.0.0",
      description: "Documentation to follow when making requests to itirena's backend",
    },
    servers: [{ url: `${process.env.BaseUrl}` }],
    tags: [
      {
        name: "Account",
        description: "Contains endpoints for Account related operations such creation login etc",
      },
      {
        name: "Courses",
        description:"Contains endpoints for Course related operations such course&timeTable data extraction,saving etc"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.resolve(__dirname, `./routes/**/*.js`)],
};

export const swaggerSpecs = swaggerJsdoc(option);


