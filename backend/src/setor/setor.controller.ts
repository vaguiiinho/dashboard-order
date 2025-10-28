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
import { SetorService } from './setor.service';
import { CreateSetorDto, UpdateSetorDto } from './dto/setor.dto';

@Controller('setores')
export class SetorController {
  constructor(private readonly setorService: SetorService) {}

  // GET /setores - Listar todos os setores
  @Get()
  async getSetores() {
    return this.setorService.findAll();
  }

  // POST /setores - Criar setor
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSetor(@Body() dto: CreateSetorDto) {
    return this.setorService.create(dto);
  }

  // PUT /setores/:id - Atualizar setor
  @Put(':id')
  async updateSetor(@Param('id') id: string, @Body() dto: UpdateSetorDto) {
    return this.setorService.update(id, dto);
  }

  // DELETE /setores/:id - Deletar setor
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSetor(@Param('id') id: string) {
    await this.setorService.delete(id);
  }
}
