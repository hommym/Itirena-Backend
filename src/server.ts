import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { connectToDatabase } from "./libs/mongoose";
import { authRouter } from "./routes/auth/authRoutes";


const app = express();




// middlewares
app.use(express.json());


// routes
app.use("/api/auth",authRouter)


// error handling middlware




const port = process.env.PORT ? process.env.PORT : 8000;
const startServer= async()=>{

  try {
    await connectToDatabase(process.env.MongoDbConnectionUrl);

    app.listen(port, () => {
      console.log(`Server  is listening on ${port} `);
    });
  } catch (error) {
    console.log(`ServerStartUpError:${error}`)
  }


}


startServer()