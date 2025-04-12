// src/jobs/cleanExpiredTokens.ts
import cron from "node-cron";
import { AppDataBase } from "../db";
import { Token } from "../models/token";
import { LessThan } from "typeorm";

cron.schedule("0 * * * *", async () => {
  const tokenRepo = AppDataBase.getRepository(Token);
  const now = new Date();

  await tokenRepo.delete({
    expiresAt: LessThan(now),
  });

  console.log(`[Job] Tokens expirados removidos às ${now.toISOString()}`);
});
