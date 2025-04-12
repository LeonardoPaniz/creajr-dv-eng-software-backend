// backend/src/routes/authRoutes.ts
import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();    

router.post("/credenciais", AuthController.login);
router.get("/home", authMiddleware, AuthController.getProfile);

export default router;
