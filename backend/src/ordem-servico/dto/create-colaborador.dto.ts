import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class CreateColaboradorDto {
  @IsString()
  @Length(1, 100)
  nome: string;

  @IsString()
  setorId: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;
}

export class UpdateColaboradorDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nome?: string;

  @IsOptional()
  @IsString()
  setorId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
