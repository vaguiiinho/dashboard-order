import { IsString, IsBoolean, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateColaboradorDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsUUID()
  setorId: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UpdateColaboradorDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  setorId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
