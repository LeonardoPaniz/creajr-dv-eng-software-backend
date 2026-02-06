import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes";
import { AppDataBase } from "./db";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", router);
app.use("/securityRoutes", authRoutes);

AppDataBase.initialize()
  .then(() => {
    app.listen(3333, () => {
      console.log(`Servidor rodando na porta 3333`);
    });
  })
  .catch((error: any) => {
    console.error("Error during Data Source initialization", error);
  });
