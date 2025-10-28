import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TipoAtividadeService } from './tipo-atividade.service';
import { CreateTipoAtividadeDto, UpdateTipoAtividadeDto } from './dto/tipo-atividade.dto';

@Controller('tipos-atividade')
export class TipoAtividadeController {
  constructor(private readonly tipoAtividadeService: TipoAtividadeService) {}

  // GET /tipos-atividade?setor=FTTH - Listar tipos de atividade por setor
  @Get()
  async getTiposAtividade(@Query('setor') setor: string) {
    return this.tipoAtividadeService.findBySetor(setor);
  }

  // POST /tipos-atividade - Criar tipo de atividade
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTipoAtividade(@Body() dto: CreateTipoAtividadeDto) {
    return this.tipoAtividadeService.create(dto);
  }

  // PUT /tipos-atividade/:id - Atualizar tipo de atividade
  @Put(':id')
  async updateTipoAtividade(@Param('id') id: string, @Body() dto: UpdateTipoAtividadeDto) {
    return this.tipoAtividadeService.update(id, dto);
  }

  // DELETE /tipos-atividade/:id - Deletar tipo de atividade
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTipoAtividade(@Param('id') id: string) {
    await this.tipoAtividadeService.delete(id);
  }
}
