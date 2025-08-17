import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha: string;

  @IsInt({ message: 'ID do grupo deve ser um número inteiro' })
  @IsNotEmpty({ message: 'ID do grupo é obrigatório' })
  grupoId: number;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  senha?: string;

  @IsOptional()
  @IsInt({ message: 'ID do grupo deve ser um número inteiro' })
  grupoId?: number;
}

export class CreateGrupoDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  nome: string;
}

export class UpdateGrupoDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  nome?: string;
}

