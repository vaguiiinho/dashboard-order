import { IsArray, IsNotEmpty, IsString, IsDateString, IsOptional, ArrayMinSize } from 'class-validator';

export class ConsultaOSPorAssuntoDto {
  @IsArray({ message: 'IDs dos assuntos devem ser um array' })
  @ArrayMinSize(1, { message: 'Pelo menos um assunto deve ser informado' })
  @IsString({ each: true, message: 'Cada ID de assunto deve ser uma string' })
  assuntoIds: string[];

  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: string;

  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim: string;
}

export class ConsultaOSPorSetorDto {
  @IsNotEmpty({ message: 'ID do setor é obrigatório' })
  @IsString({ message: 'ID do setor deve ser uma string' })
  setorId: string;

  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: string;

  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim: string;
}

export class ConsultaOSPorColaboradorDto {
  @IsArray({ message: 'IDs dos técnicos devem ser um array' })
  @ArrayMinSize(1, { message: 'Pelo menos um técnico deve ser informado' })
  @IsString({ each: true, message: 'Cada ID de técnico deve ser uma string' })
  tecnicoIds: string[];

  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: string;

  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim: string;
}

export class ConsultaOSPorCidadeDto {
  @IsArray({ message: 'IDs das cidades devem ser um array' })
  @ArrayMinSize(1, { message: 'Pelo menos uma cidade deve ser informada' })
  @IsString({ each: true, message: 'Cada ID de cidade deve ser uma string' })
  cidadeIds: string[];

  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: string;

  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim: string;
}

export class ConsultaPorIdsDto {
  @IsArray({ message: 'IDs devem ser um array' })
  @ArrayMinSize(1, { message: 'Pelo menos um ID deve ser informado' })
  @IsString({ each: true, message: 'Cada ID deve ser uma string' })
  ids: string[];
}

export class FiltroPeriodoDto {
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: string;

  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim: string;

  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  status?: string;
}
