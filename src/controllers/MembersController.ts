//controllers/MembersController.ts
import { Request, Response } from "express";
import { AppDataBase } from "../db";
import { Member } from "../models/member";
import bcrypt from "bcryptjs";
export class MemberController {
  static async getAllMembers(req: Request, res: Response) {
    try {
      const memberRepository = AppDataBase.getRepository(Member);
      const members = await memberRepository.find();
      res.json(members);
    } catch (error: any) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Failed to get members", error });
    }
  }

  static async getMemberById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const memberRepository = AppDataBase.getRepository(Member);
      const member = await memberRepository.findOneBy({
        id: id,
      });
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ message: "Failed to get member", error });
    }
  }

  static async getMemberByEmail(req: Request, res: Response) {
    const email = req.params.email;
    try {
      const memberRepository = AppDataBase.getRepository(Member);
      const member = await memberRepository.findOneBy({
        email_personal: email,
      });
      if (!member) {
        // GAMBIARRA , Favor modificar
        return res.status(202).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ message: "Failed to get member", error });
    }
  }

  static async getMembersBySponsor(req: Request, res: Response) {
    const sponsorId = req.params.sponsorId;
    try {
      const memberRepository = AppDataBase.getRepository(Member);
      const members = await memberRepository.findBy({ sponsor: sponsorId });

      if (members.length === 0) {
        return res
          .status(404)
          .json({ message: "No members found with this sponsor" });
      }

      res.json(members);
    } catch (error) {
      console.error("Error fetching members by sponsor:", error);
      res.status(500).json({ message: "Failed to get members", error });
    }
  }

  static async createNewMember(req: Request, res: Response) {
    const { password, ...memberData } = req.body;
    console.log("Backend received data:", memberData);

    try {
      const normalizedData = {
        ...memberData,
        cpf: memberData.cpf.replace(/\D/g, ""),
        birth_date: new Date(memberData.birth_date),
        admission_date: new Date(memberData.admission_date),
        ra: String(memberData.ra), // Garante que é string
        position: memberData.position || "Membro",
        biography: memberData.biography || null, // Corrige o typo
      };
      const memberRepository = AppDataBase.getRepository(Member);
      const existing = await memberRepository.findOne({
        where: [
          { email_personal: normalizedData.email_personal },
          { email_university: normalizedData.email_university },
          { cpf: normalizedData.cpf },
          { ra: normalizedData.ra },
        ],
      });

      if (existing) {
        return res.status(409).json({
          message: "CPF, RA ou email já cadastrados",
        });
      }

      // 3. Criar hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      const { confirm_password, ...dataWithoutConfirmPassword } = normalizedData;
      console.log("Dado Final:", { ...dataWithoutConfirmPassword, password: hashedPassword });
      // 4. Preparar dados para criação
        const newMember = memberRepository.create({
          ...normalizedData,
          password: hashedPassword,
          sponsor: memberData.sponsor || null
        });

      // 5. Criar e salvar membro
      const savedMember = await memberRepository.save(newMember);

      // 6. Remover senha da resposta
      const { password: _, ...safeMemberData } = savedMember;

      // 7. Retornar resposta
      return res.status(201).json({
        message: "Membro criado com sucesso!",
        data: safeMemberData,
      });
    } catch (error: any) {
      console.error("ERRO DETALHADO:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        driverError: error.driverError,
        code: error.code,
      });

      if (error.code === "23505") {
        // Código de erro para violação de constraint única
        return res.status(409).json({
          message: "Violação de dado único (CPF, RA ou email já existente)",
        });
      }

      return res.status(500).json({
        message: "Erro ao criar membro",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static async UpdateMemberData(req: Request, res: Response) {
    const id = req.params.id; // Capturando o ID do membro da URL
    const updateData = req.body; // Dados enviados no corpo da requisição

    try {
      const memberRepository = AppDataBase.getRepository(Member);

      // Verificar se o membro existe
      const existingMember = await memberRepository.findOneBy({ id });
      if (!existingMember) {
        return res.status(404).json({ message: "Member not found" });
      }

      // Atualizar os dados do membro com os valores do corpo da requisição
      const updatedMember = memberRepository.merge(existingMember, updateData);

      // Salvar as alterações no banco de dados
      const savedMember = await memberRepository.save(updatedMember);

      // Retornar a resposta com os dados atualizados
      res.status(200).json({
        message: "Member updated successfully!",
        data: savedMember,
      });
    } catch (error) {
      console.error("Error updating member:", error);

      res.status(500).json({ message: "Failed to update member", error });
    }
  }
}
