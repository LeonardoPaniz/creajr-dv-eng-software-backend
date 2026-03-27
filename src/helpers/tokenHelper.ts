import * as jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

/**
 * Extrai o memberId do accessToken
 * @param accessToken - O token de acesso JWT
 * @returns O memberId
 * @throws Error se o token for inválido ou expirado
 */
export function getMemberIdFromAccessToken(accessToken: string): string {
  if (!authConfig.jwt.secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const decoded = jwt.verify(accessToken, authConfig.jwt.secret) as {
      id: string;
      email: string;
      roles: string[];
    };
    return decoded.id;
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
}
