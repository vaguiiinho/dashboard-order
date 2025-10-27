import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdemServicoService } from './ordem-servico.service';
import { CreateRegistroOSDto } from './dto/create-registro-os.dto';
import { CreateMultipleRegistrosOSDto } from './dto/create-multiple-registros-os.dto';

@Controller('ordem-servico')
export class OrdemServicoController {
  constructor(private readonly ordemServicoService: OrdemServicoService) {}

  // GET /ordem-servico/setores - Listar todos os setores
  @Get('setores')
  async getSetores() {
    return this.ordemServicoService.findAllSetores();
  }

  // GET /ordem-servico/colaboradores?setor=FTTH - Listar colaboradores por setor
  @Get('colaboradores')
  async getColaboradores(@Query('setor') setor: string) {
    return this.ordemServicoService.findColaboradoresBySetor(setor);
  }

  // GET /ordem-servico/tipos-atividade?setor=FTTH - Listar tipos de atividade por setor
  @Get('tipos-atividade')
  async getTiposAtividade(@Query('setor') setor: string) {
    return this.ordemServicoService.findTiposAtividadeBySetor(setor);
  }

  // POST /ordem-servico/registro - Criar um único registro
  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async createRegistro(@Body() dto: CreateRegistroOSDto) {
    return this.ordemServicoService.createRegistro(dto);
  }

  // POST /ordem-servico/registros - Criar múltiplos registros
  @Post('registros')
  @HttpCode(HttpStatus.CREATED)
  async createMultipleRegistros(@Body() dto: CreateMultipleRegistrosOSDto) {
    return this.ordemServicoService.createMultipleRegistros(dto.registros);
  }

  // GET /ordem-servico/registros - Listar todos os registros com filtros opcionais
  @Get('registros')
  async getAllRegistros(
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('setor') setorNome?: string,
  ) {
    return this.ordemServicoService.findAllRegistros({ mes, ano, setorNome });
  }

  // GET /ordem-servico/relatorio - Gerar relatório com estatísticas
  @Get('relatorio')
  async getRelatorio(@Query('mes') mes?: string, @Query('ano') ano?: string) {
    return this.ordemServicoService.gerarRelatorio({ mes, ano });
  }

  // DELETE /ordem-servico/registro/:id - Deletar um registro
  @Delete('registro/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRegistro(@Param('id') id: string) {
    await this.ordemServicoService.deleteRegistro(id);
  }
}

