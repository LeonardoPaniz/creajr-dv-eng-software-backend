import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: '12345678900' })
  cpf: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: '11999999999' })
  phone: string;

  @ApiProperty({ example: 'joao@example.com' })
  email_personal: string;

  @ApiProperty({ example: 'joao@university.edu' })
  email_university: string;

  @ApiProperty({ example: '1234567890' })
  ra: string;

  @ApiProperty({ example: '2000-01-01' })
  birth_date: string;

  @ApiProperty({
    example: 'uuid-do-vinculo-curso-universidade',
    description: 'Optional relation to a course university record',
    required: false,
  })
  @IsUUID()
  course_university_id?: string;

  @ApiProperty({ example: '2024-01-01' })
  admission_date: string;

  @ApiProperty({ example: 'Membro', required: false })
  position?: string;

  @ApiProperty({ example: 'sponsor-uuid', required: false })
  sponsor?: string;

  @ApiProperty({ example: 'Biografia do membro', required: false })
  biography?: string;
}
