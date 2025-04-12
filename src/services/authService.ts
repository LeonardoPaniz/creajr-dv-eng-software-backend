// backend/src/services/authService.ts
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";
import { Member } from "../models/member";
import bcrypt from "bcryptjs";
import { AppDataBase } from "../db";
import { Token } from "../models/token";

export class AuthService {
  static async generateToken(member: Member): Promise<string> {
    const tokenRepo = AppDataBase.getRepository(Token);
    await tokenRepo.delete({ memberId: member.id });
    
    const token = jwt.sign(
      {
        id: member.id,
        email: member.email_personal,
        position: member.position,
      },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.expiresIn }
    );

    // Salva token no banco
    const decoded = jwt.decode(token) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    await tokenRepo.save({
      token,
      memberId: member.id,
      expiresAt,
    });

    return token;
  }

  static async verifyToken(token: string): Promise<{
    id: string;
    email: string;
    position: string;
  }> {
    if (!authConfig.jwt.secret) {
      throw new Error("JWT secret is not defined in the configuration.");
    }

    const tokenRepo = AppDataBase.getRepository(Token);
    const savedToken = await tokenRepo.findOneBy({ token });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      throw new Error("Token inválido ou expirado");
    }

    return jwt.verify(token, authConfig.jwt.secret) as {
      id: string;
      email: string;
      position: string;
    };
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
