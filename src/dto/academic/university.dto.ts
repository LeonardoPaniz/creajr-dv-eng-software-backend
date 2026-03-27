import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty({ example: 'Universidade de São Paulo', description: 'Nome da universidade' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'USP', description: 'Sigla da universidade', required: false })
  @IsOptional()
  @IsString()
  acronym?: string;
}
