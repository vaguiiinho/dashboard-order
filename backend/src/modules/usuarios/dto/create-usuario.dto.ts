import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsInt()
  @IsNotEmpty()
  grupoId: number;
}

export class UpdateUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @MinLength(6)
  senha?: string;

  @IsInt()
  grupoId?: number;
}

