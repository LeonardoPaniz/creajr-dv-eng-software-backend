import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty({ example: 'João Silva', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '11999999999', required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Biografia atualizada', required: false })
  @IsOptional()
  biography?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  @IsOptional()
  profile_picture_url?: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
  @IsOptional()
  banner_url?: string;

  @ApiProperty({ example: 'https://linkedin.com/in/user', required: false })
  @IsOptional()
  linkedin_url?: string;

  @ApiProperty({ example: 'https://github.com/user', required: false })
  @IsOptional()
  github_url?: string;

  @ApiProperty({
    example: 'uuid-do-vinculo-curso-universidade',
    description: 'Optional link to enroll member in a course university record',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  course_university_id?: string;
}
