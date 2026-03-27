import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ 
    example: 'CREATE_PROJECTS', 
    description: 'Nome único da permissão (em MAIÚSCULAS)' 
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'Criar novos projetos', 
    description: 'Descrição da permissão',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'projects', 
    description: 'Recurso ao qual a permissão se aplica (ex: members, projects, reports)' 
  })
  @IsString()
  resource: string;

  @ApiProperty({ 
    example: 'create', 
    description: 'Ação permitida (ex: read, create, update, delete, manage)' 
  })
  @IsString()
  action: string;
}

export class UpdatePermissionDto {
  @ApiProperty({ 
    example: 'CREATE_PROJECTS', 
    description: 'Nome da permissão',
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: 'Criar e gerenciar projetos', 
    description: 'Descrição da permissão',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'projects', 
    description: 'Recurso',
    required: false 
  })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiProperty({ 
    example: 'manage', 
    description: 'Ação',
    required: false 
  })
  @IsOptional()
  @IsString()
  action?: string;
}
