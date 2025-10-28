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

@Controller('registros-os')
export class OrdemServicoController {
  constructor(private readonly ordemServicoService: OrdemServicoService) {}

  // POST /registros-os - Criar um único registro
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRegistro(@Body() dto: CreateRegistroOSDto) {
    return this.ordemServicoService.createRegistro(dto);
  }

  // POST /registros-os/batch - Criar múltiplos registros
  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async createMultipleRegistros(@Body() dto: CreateMultipleRegistrosOSDto) {
    return this.ordemServicoService.createMultipleRegistros(dto.registros);
  }

  // GET /registros-os - Listar todos os registros com filtros opcionais
  @Get()
  async getAllRegistros(
    @Query('mes') mes?: string,
    @Query('ano') ano?: string,
    @Query('setor') setorNome?: string,
  ) {
    return this.ordemServicoService.findAllRegistros({ mes, ano, setorNome });
  }

  // GET /registros-os/cidades - Listar todas as cidades
  @Get('cidades')
  async getCidades() {
    return this.ordemServicoService.findAllCidades();
  }

  // GET /registros-os/relatorio - Gerar relatório com estatísticas
  @Get('relatorio')
  async getRelatorio(@Query('mes') mes?: string, @Query('ano') ano?: string) {
    return this.ordemServicoService.gerarRelatorio({ mes, ano });
  }

  // GET /registros-os/relatorio/cidade - Gerar relatório por cidade
  @Get('relatorio/cidade')
  async getRelatorioPorCidade(@Query('mes') mes?: string, @Query('ano') ano?: string) {
    return this.ordemServicoService.gerarRelatorioPorCidade({ mes, ano });
  }

  // DELETE /registros-os/:id - Deletar um registro
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRegistro(@Param('id') id: string) {
    await this.ordemServicoService.deleteRegistro(id);
  }
}

