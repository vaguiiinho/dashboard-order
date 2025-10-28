import { IsString, IsBoolean, IsOptional, MaxLength, Length } from 'class-validator';

export class CreateCidadeDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsString()
  @Length(2, 2)
  estado: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UpdateCidadeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
