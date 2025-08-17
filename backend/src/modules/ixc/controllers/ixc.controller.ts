import { Controller, Post, Body, Get, Query, ValidationPipe } from '@nestjs/common';
import { ConsultarOSPorAssuntoUseCase } from '../use-cases/consultar-os-por-assunto.use-case';
import { ConsultaOSPorAssuntoDto } from '../dto/consulta-os.dto';
import { ListaOSResponseDto } from '../dto/resposta-ixc.dto';

@Controller('ixc')
export class IXCController {
  constructor(
    private readonly consultarOSPorAssuntoUseCase: ConsultarOSPorAssuntoUseCase
  ) {}

  @Post('os/por-assunto')
  async consultarOSPorAssunto(
    @Body(ValidationPipe) dto: ConsultaOSPorAssuntoDto
  ): Promise<ListaOSResponseDto> {
    return this.consultarOSPorAssuntoUseCase.execute(dto);
  }

  @Get('assuntos')
  async listarAssuntos() {
    // TODO: Implementar use case para listar assuntos
    return { message: 'Endpoint para listar assuntos - em implementação' };
  }

  @Get('cidades')
  async listarCidades() {
    // TODO: Implementar use case para listar cidades
    return { message: 'Endpoint para listar cidades - em implementação' };
  }

  @Get('colaboradores')
  async listarColaboradores() {
    // TODO: Implementar use case para listar colaboradores
    return { message: 'Endpoint para listar colaboradores - em implementação' };
  }

  @Get('dashboard')
  async obterDadosDashboard(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string
  ) {
    // TODO: Implementar use case para dashboard
    return { 
      message: 'Endpoint para dashboard - em implementação',
      periodo: { dataInicio, dataFim }
    };
  }
}
