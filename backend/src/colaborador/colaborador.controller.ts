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
import { ColaboradorService } from './colaborador.service';
import { CreateColaboradorDto, UpdateColaboradorDto } from './dto/colaborador.dto';

@Controller('colaboradores')
export class ColaboradorController {
  constructor(private readonly colaboradorService: ColaboradorService) {}

  // GET /colaboradores?setor=FTTH - Listar colaboradores por setor
  @Get()
  async getColaboradores(@Query('setor') setor: string) {
    return this.colaboradorService.findBySetor(setor);
  }

  // POST /colaboradores - Criar colaborador
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createColaborador(@Body() dto: CreateColaboradorDto) {
    return this.colaboradorService.create(dto);
  }

  // PUT /colaboradores/:id - Atualizar colaborador
  @Put(':id')
  async updateColaborador(@Param('id') id: string, @Body() dto: UpdateColaboradorDto) {
    return this.colaboradorService.update(id, dto);
  }

  // DELETE /colaboradores/:id - Deletar colaborador
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteColaborador(@Param('id') id: string) {
    await this.colaboradorService.delete(id);
  }
}
