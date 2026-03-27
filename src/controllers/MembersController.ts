import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Headers,
  HttpException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { MemberService } from "../services/MemberService";
import { CreateMemberDto } from "../dto/members/create-member.dto";
import { UpdateMemberDto } from "../dto/members/update-member.dto";
import { getMemberIdFromAccessToken } from "../helpers/tokenHelper";

@Controller("members")
@ApiTags("Members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiOperation({ summary: "Get all members" })
  @ApiResponse({ status: 200, description: "List of all members" })
  async getAllMembers() {
    return this.memberService.getAllMembers();
  }

  @Get("profile/:slug")
  @ApiOperation({ summary: "Get member profile by slug (public)" })
  @ApiParam({
    name: "slug",
    type: String,
    example: "john-doe",
  })
  @ApiResponse({ status: 200, description: "Member profile found" })
  @ApiResponse({ status: 404, description: "Member not found" })
  async getMemberBySlug(@Param("slug") slug: string) {
    return this.memberService.getMemberBySlug(slug);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get member by ID" })
  @ApiParam({
    name: "id",
    type: String,
    example: "b314b18f-26d6-4f97-9ed2-1f3942f8b787",
  })
  @ApiResponse({ status: 200, description: "Member found" })
  @ApiResponse({ status: 404, description: "Member not found" })
  async getMemberById(@Param("id") id: string) {
    return this.memberService.getMemberById(id);
  }

  @Get("email/:email")
  @ApiOperation({ summary: "Get member by email" })
  @ApiParam({ name: "email", type: String, example: "user@example.com" })
  @ApiResponse({ status: 200, description: "Member found" })
  @ApiResponse({ status: 202, description: "Member not found" })
  async getMemberByEmail(@Param("email") email: string) {
    return this.memberService.getMemberByEmail(email);
  }

  @Get("sponsor/:sponsorId")
  @ApiOperation({ summary: "Get members by sponsor" })
  @ApiParam({
    name: "sponsorId",
    type: String,
    example: "b314b18f-26d6-4f97-9ed2-1f3942f8b787",
  })
  @ApiResponse({ status: 200, description: "Members found" })
  @ApiResponse({ status: 404, description: "No members found" })
  async getMembersBySponsor(@Param("sponsorId") sponsorId: string) {
    return this.memberService.getMembersBySponsor(sponsorId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create new member" })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({ status: 201, description: "Member created successfully" })
  @ApiResponse({ status: 409, description: "CPF, RA or email already exists" })
  async createNewMember(@Body() body: CreateMemberDto) {
    const { password, ...memberData } = body;
    const safeMemberData = await this.memberService.createMember(
      memberData,
      password,
    );
    return {
      message: "Membro criado com sucesso!",
      data: safeMemberData,
    };
  }

  @Put("id/:id")
  @ApiOperation({ summary: "Update member data" })
  @ApiParam({
    name: "id",
    type: String,
    example: "b314b18f-26d6-4f97-9ed2-1f3942f8b787",
  })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({ status: 200, description: "Member updated successfully" })
  @ApiResponse({ status: 404, description: "Member not found" })
  async updateMemberData(
    @Param("id") id: string,
    @Body() updateData: UpdateMemberDto,
  ) {
    const savedMember = await this.memberService.updateMember(id, updateData);
    return {
      message: "Member updated successfully!",
      data: savedMember,
    };
  }

  @Get(":memberId/roles-and-permissions")
  @ApiOperation({ summary: "Get member roles and permissions" })
  @ApiParam({
    name: "memberId",
    type: String,
    example: "b314b18f-26d6-4f97-9ed2-1f3942f8b787",
  })
  @ApiResponse({
    status: 200,
    description: "Member roles and permissions retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Member not found" })
  @ApiResponse({ status: 401, description: "Unauthorized - Invalid token or memberId mismatch" })
  async getMemberRolesAndPermissions(
    @Param("memberId") memberId: string,
    @Headers("authorization") authorization: string,
  ) {
    try {
      if (!authorization) {
        throw new UnauthorizedException("Authorization header is missing");
      }

      // Extrair o token do header "Bearer xxxxx"
      const token = authorization.replace("Bearer ", "");
      
      const memberIdFromAcessToken = getMemberIdFromAccessToken(token);
      if (memberIdFromAcessToken !== memberId) {
        throw new UnauthorizedException("Token memberId does not match the requested memberId");
      }
      return this.memberService.getMemberRolesAndPermissions(memberId);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof Error && error.message.includes("Token inválido ou expirado")) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
