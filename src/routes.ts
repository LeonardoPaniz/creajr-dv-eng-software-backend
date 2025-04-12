//backend/src/routes.ts
import { Router } from "express";
import { MemberController } from "./controllers/MembersController";
import { AuthController } from "../src/controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";

const router = Router();
// Adicionar o authMiddleware para proteger as rotas nesseárias.
router.get("/members", MemberController.getAllMembers);
router.get("/member/id/:id", MemberController.getMemberById);
router.get("/member/email/:email", MemberController.getMemberByEmail);
router.get("/members/sponsor/:sponsorId", MemberController.getMembersBySponsor);
router.post("/member/", MemberController.createNewMember);
router.put('/member/id/:id', MemberController.UpdateMemberData)

router.post("/auth/login", AuthController.login);
router.get("/auth/profile/:id", authMiddleware, AuthController.getProfile);
router.get("/auth/validate-token", AuthController.validateToken);


export default router;
