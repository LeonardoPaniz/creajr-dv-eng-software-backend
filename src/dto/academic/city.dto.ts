import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ example: 'São Paulo', description: 'Nome da cidade' })
  @IsString()
  name: string;

  @ApiProperty({ example: '3550308', description: 'Código IBGE', required: false })
  @IsOptional()
  @IsString()
  ibge_code?: string;

  @ApiProperty({ example: 'uuid-do-estado', description: 'ID do estado' })
  @IsUUID()
  state_id: string;
}
