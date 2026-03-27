import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class LinkCourseUniversityDto {
  @ApiProperty({ example: 'uuid-do-curso', description: 'ID do curso' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 'uuid-da-universidade', description: 'ID da universidade' })
  @IsUUID()
  universityId: string;

  @ApiProperty({ example: 'uuid-da-cidade', description: 'ID da cidade' })
  @IsUUID()
  cityId: string;
}

export class CreateProgramSemesterDto {
  @ApiProperty({ example: 'uuid-do-curso', description: 'ID do curso' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 1, description: 'Número do semestre' })
  @IsInt()
  @Min(1)
  semester_number: number;
}

export class CreateAcademicTermDto {
  @ApiProperty({ example: 2024, description: 'Ano' })
  @IsInt()
  year: number;

  @ApiProperty({ example: '1S', description: 'Período (1S, 2S, etc)' })
  @IsString()
  term: string;

  @ApiProperty({ example: '2024-02-01', description: 'Data de início', required: false })
  @IsOptional()
  @IsDateString()
  starts_at?: string;

  @ApiProperty({ example: '2024-06-30', description: 'Data de término', required: false })
  @IsOptional()
  @IsDateString()
  ends_at?: string;
}

export class CreateSemesterOfferingDto {
  @ApiProperty({ example: 'uuid-do-course-university', description: 'ID do vínculo curso-universidade' })
  @IsUUID()
  course_university_id: string;

  @ApiProperty({ example: 'uuid-do-program-semester', description: 'ID do semestre do programa' })
  @IsUUID()
  program_semester_id: string;

  @ApiProperty({ example: 'uuid-do-academic-term', description: 'ID do período acadêmico' })
  @IsUUID()
  academic_term_id: string;

  @ApiProperty({ example: 'planned', description: 'Status', enum: ['planned', 'active', 'closed', 'cancelled'], required: false })
  @IsOptional()
  @IsEnum(['planned', 'active', 'closed', 'cancelled'])
  status?: string;
}

export class CreateEnrollmentDto {
  @ApiProperty({ example: 'uuid-do-membro', description: 'ID do membro' })
  @IsUUID()
  member_id: string;

  @ApiProperty({ example: 'uuid-do-semester-offering', description: 'ID da oferta de semestre' })
  @IsUUID()
  semester_offering_id: string;

  @ApiProperty({ example: 'active', description: 'Status', enum: ['active', 'approved', 'failed', 'suspended', 'cancelled'], required: false })
  @IsOptional()
  @IsEnum(['active', 'approved', 'failed', 'suspended', 'cancelled'])
  status?: string;
}
