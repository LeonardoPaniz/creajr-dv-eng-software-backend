import { ApiProperty } from "@nestjs/swagger";

export class CreateMemberDto {
  @ApiProperty({ example: "João Silva" })
  name?: string;

  @ApiProperty({ example: "12345678900" })
  cpf?: string;

  @ApiProperty({ example: "password123" })
  password?: string;

  @ApiProperty({ example: "11999999999" })
  phone?: string;

  @ApiProperty({ example: "joao@example.com" })
  email_personal?: string;

  @ApiProperty({ example: "joao@university.edu" })
  email_university?: string;

  @ApiProperty({ example: "1234567890" })
  ra?: string;

  @ApiProperty({ example: "2000-01-01" })
  birth_date?: string;

  @ApiProperty({ example: "Universidade Federal" })
  university?: string;

  @ApiProperty({ example: "Engenharia de Software" })
  course?: string;

  @ApiProperty({ example: "Campus Central" })
  campus?: string;

  @ApiProperty({ example: "2024-01-01" })
  admission_date?: string;

  @ApiProperty({ example: "Membro", required: false })
  position?: string;

  @ApiProperty({ example: "sponsor-uuid", required: false })
  sponsor?: string;

  @ApiProperty({ example: "Biografia do membro", required: false })
  biography?: string;
}

export class UpdateMemberDto {
  @ApiProperty({ example: "João Silva", required: false })
  name?: string;

  @ApiProperty({ example: "11999999999", required: false })
  phone?: string;

  @ApiProperty({ example: "Biografia atualizada", required: false })
  biography?: string;

  @ApiProperty({ example: "https://example.com/profile.jpg", required: false })
  profile_picture_url?: string;

  @ApiProperty({ example: "https://example.com/banner.jpg", required: false })
  banner_url?: string;

  @ApiProperty({ example: "https://linkedin.com/in/user", required: false })
  linkedin_url?: string;

  @ApiProperty({ example: "https://github.com/user", required: false })
  github_url?: string;
}
