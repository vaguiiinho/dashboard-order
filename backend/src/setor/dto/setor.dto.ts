import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateSetorDto {
  @IsString()
  @MaxLength(50)
  nome: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UpdateSetorDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nome?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
