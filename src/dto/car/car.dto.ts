import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'CAR São Paulo Capital', description: 'Nome da CAR' })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Atende região metropolitana de São Paulo', 
    description: 'Descrição da CAR',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddManagerDto {
  @ApiProperty({ example: 'uuid-do-membro', description: 'ID do membro gestor' })
  @IsUUID()
  memberId: string;
}

export class ManageCitiesDto {
  @ApiProperty({ 
    example: ['uuid-cidade-1', 'uuid-cidade-2'], 
    description: 'Array de IDs das cidades',
    type: [String]
  })
  @IsArray()
  @IsUUID('4', { each: true })
  cityIds: string[];
}
