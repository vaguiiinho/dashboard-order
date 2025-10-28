import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';

export class CreateSetorDto {
  @IsString()
  @Length(1, 50)
  nome: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean = true;
}

export class UpdateSetorDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nome?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
