import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class CreateCidadeDto {
  @IsString()
  @Length(1, 100)
  nome: string;

  @IsString()
  @Length(2, 2)
  estado: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;
}

export class UpdateCidadeDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nome?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
