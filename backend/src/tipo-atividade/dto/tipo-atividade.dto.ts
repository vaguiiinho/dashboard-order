import { IsString, IsBoolean, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateTipoAtividadeDto {
  @IsString()
  @MaxLength(200)
  nome: string;

  @IsString()
  @IsUUID()
  setorId: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UpdateTipoAtividadeDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  nome?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  setorId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
