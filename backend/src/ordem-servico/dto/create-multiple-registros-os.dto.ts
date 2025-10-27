import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { CreateRegistroOSDto } from './create-registro-os.dto';

export class CreateMultipleRegistrosOSDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRegistroOSDto)
  registros: CreateRegistroOSDto[];
}

