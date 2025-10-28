import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { CreateCidadeDto, UpdateCidadeDto } from './dto/cidade.dto';

@Controller('cidades')
export class CidadeController {
  constructor(private readonly cidadeService: CidadeService) {}

  // GET /cidades - Listar todas as cidades
  @Get()
  async getCidades() {
    return this.cidadeService.findAll();
  }

  // POST /cidades - Criar cidade
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCidade(@Body() dto: CreateCidadeDto) {
    return this.cidadeService.create(dto);
  }

  // PUT /cidades/:id - Atualizar cidade
  @Put(':id')
  async updateCidade(@Param('id') id: string, @Body() dto: UpdateCidadeDto) {
    return this.cidadeService.update(id, dto);
  }

  // DELETE /cidades/:id - Deletar cidade
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCidade(@Param('id') id: string) {
    await this.cidadeService.delete(id);
  }
}
