import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Engenharia de Software', description: 'Nome do curso' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'São Carlos', description: 'Campus', required: false })
  @IsOptional()
  @IsString()
  campus?: string;

  @ApiProperty({ example: 'uuid-da-universidade', description: 'ID da universidade' })
  @IsUUID()
  university_id: string;
}
