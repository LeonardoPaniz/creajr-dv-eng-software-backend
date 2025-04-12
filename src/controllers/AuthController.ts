// backend/src/controllers/AuthController.ts
import { Request, Response } from "express";
import { AppDataBase } from "../db";
import { Member } from "../models/member";
import { AuthService } from "../services/authService";
import { Token } from "../models/token";

export class AuthController {

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const memberRepository = AppDataBase.getRepository(Member);
      const member = await memberRepository.findOne({
        where: { email_personal: email },
        select: ["id", "password", "email_personal", "position", "name"],
      });

      if (!member) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const passwordMatch = await AuthService.comparePasswords(
        password,
        member.password
      );
      if (!passwordMatch) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = await AuthService.generateToken(member);

      // Remove a senha antes de retornar
      const { password: _, ...memberWithoutPassword } = member;
      console.log("memberWithoutPassword", memberWithoutPassword); // Verifica se a senha foi removida corretamente
      console.log("member", member); // Verifica se a senha foi removida corretamente
      console.log("token", token); // Verifica se o token foi gerado corretamente
      
      return res.json({
        member: memberWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error); //login is a not a function
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async getProfile(req: Request, res: Response) {
    // O middleware já validou o token e adicionou o usuário na requisição
    const userId = req.user?.id;
    console.log("ID do usuário:", userId); //ID do usuário: undefined

    try {
      const memberRepository = AppDataBase.getRepository(Member);
      const member = await memberRepository.findOne({
        where: { id: userId },
      });

      if (!member) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json(member);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async validateToken(req: Request, res: Response) {
    console.log("Validando token...");
    const tokenRepository = AppDataBase.getRepository(Token);
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];      

      if (!token)
        return res.status(401).json({ message: "Token não fornecido" });

      const tokenData = await tokenRepository.findOne({ where: { token } });

      if (!tokenData || new Date(tokenData.expiresAt) < new Date()) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
      }

      return res.status(200).json({ valid: true });
    } catch (err) {
      return res.status(401).json({ message: "Token inválido" });
    }finally{
    console.log("Validado.");

    }
  }
}
