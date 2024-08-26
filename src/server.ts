import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase } from "./libs/mongoose";
import { authRouter } from "./routes/auth/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "./swaggerConfig";
import { loger } from "./components/logger";

const app = express();

// setting up swagger-ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/auth/", authRouter);

// error handling middlware
app.use(errorHandler);

const port = process.env.PORT ? process.env.PORT : 8000;
const startServer = async () => {
  try {
    await connectToDatabase(process.env.MongoDbConnectionUrl);

    app.listen(port, () => {
      console.log(`Server  is listening on ${port} `);
      loger(swaggerSpecs);
    });
  } catch (error) {
    console.log(`ServerStartUpError:${error}`);
  }
};

startServer();
