import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class CreateTipoAtividadeDto {
  @IsString()
  @Length(1, 200)
  nome: string;

  @IsString()
  setorId: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;
}

export class UpdateTipoAtividadeDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  nome?: string;

  @IsOptional()
  @IsString()
  setorId?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
