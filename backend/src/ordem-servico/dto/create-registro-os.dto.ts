import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';

export class CreateRegistroOSDto {
  @IsString()
  setor: string;

  @IsString()
  colaborador: string;

  @IsString()
  tipoAtividade: string;

  @IsInt()
  @Min(1)
  quantidade: number;

  @IsString()
  @Length(2, 2)
  mes: string;

  @IsString()
  @Length(4, 4)
  ano: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

