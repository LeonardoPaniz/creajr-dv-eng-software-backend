//backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = parts[1];

  try {
    const decoded = await AuthService.verifyToken(token);
    console.log("Token decodificado:", decoded);
    req.user = decoded; // Adiciona os dados do usuário à requisição
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
