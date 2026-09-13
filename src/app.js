import express from "express";
import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth-routes.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { userRouter } from "./routes/user-routes.js";
import cookieParser from "cookie-parser";
import { connectionRouter } from "./routes/connection-routes.js";
import cors from 'cors'

const app = express();

// using essential middelwares
app.use(cors({
  origin: "http://10.112.204.80:5173",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())




// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/connection", connectionRouter)


// using error middleware to handle error efficiently
app.use(errorMiddleware)



const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  } catch (error) {
    console.error(error.message)
  }
};


startServer()
