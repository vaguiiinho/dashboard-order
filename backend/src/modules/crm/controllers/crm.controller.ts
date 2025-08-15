import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CrmService } from '../services/crm.service';
import type {
  OSPorAssuntoDto,
  OSPorSetorDto,
  OSPorColaboradorDto,
  OSPorCidadeDto,
  AssuntoPorIdDto,
  CidadePorIdDto,
  ColaboradorPorIdDto,
  DashboardDataDto,
} from '../interfaces/crm.interfaces';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Post('os-por-assunto')
  async getOSPorAssunto(@Body() dto: OSPorAssuntoDto) {
    return this.crmService.getOSPorAssunto(dto);
  }

  @Post('os-por-setor')
  async getOSPorSetor(@Body() dto: OSPorSetorDto) {
    return this.crmService.getOSPorSetor(dto);
  }

  @Post('os-por-colaborador')
  async getOSPorColaborador(@Body() dto: OSPorColaboradorDto) {
    return this.crmService.getOSPorColaborador(dto);
  }

  @Post('os-por-cidade')
  async getOSPorCidade(@Body() dto: OSPorCidadeDto) {
    return this.crmService.getOSPorCidade(dto);
  }

  @Post('assunto-por-id')
  async getAssuntoPorId(@Body() dto: AssuntoPorIdDto) {
    return this.crmService.getAssuntoPorId(dto);
  }

  @Post('cidade-por-id')
  async getCidadePorId(@Body() dto: CidadePorIdDto) {
    return this.crmService.getCidadePorId(dto);
  }

  @Post('colaborador-por-id')
  async getColaboradorPorId(@Body() dto: ColaboradorPorIdDto) {
    return this.crmService.getColaboradorPorId(dto);
  }

  @Get('dashboard-data')
  async getDashboardData(@Query() query: any) {
    const dto: DashboardDataDto = {
      dataInicio: query.dataInicio,
      dataFim: query.dataFim,
      colaboradorIds: query.colaboradorIds ? 
        (typeof query.colaboradorIds === 'string' ? query.colaboradorIds.split(',') : query.colaboradorIds) 
        : undefined
    };
    return this.crmService.getDashboardData(dto);
  }

  @Post('dashboard-data')
  async getDashboardDataPost(@Body() dto: DashboardDataDto) {
    return this.crmService.getDashboardData(dto);
  }
}
