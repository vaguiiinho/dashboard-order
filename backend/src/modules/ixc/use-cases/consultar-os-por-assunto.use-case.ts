import { Injectable, BadRequestException } from '@nestjs/common';
import { ConsultaOSPorAssuntoDto } from '../dto/consulta-os.dto';
import { ListaOSResponseDto } from '../dto/resposta-ixc.dto';
import { OrdemServico } from '../entities/ordem-servico.entity';
import type { IIXCRepository } from '../repositories/ixc.repository.interface';

@Injectable()
export class ConsultarOSPorAssuntoUseCase {
  constructor(private readonly ixcRepository: IIXCRepository) {}

  async execute(dto: ConsultaOSPorAssuntoDto): Promise<ListaOSResponseDto> {
    try {
      // Validar período
      this.validarPeriodo(dto.dataInicio, dto.dataFim);

      // Consultar O.S no repositório
      const resultado = await this.ixcRepository.consultarOSPorAssunto(
        dto.assuntoIds,
        dto.dataInicio,
        dto.dataFim
      );

      // Converter para entidades de domínio
      const ordensServico = resultado.registros.map(os => OrdemServico.fromData(os));

      // Filtrar apenas O.S finalizadas (status F)
      const osFinalizadas = ordensServico.filter(os => os.isFinalizada());

      // Retornar DTO de resposta
      return new ListaOSResponseDto(
        resultado.total,
        osFinalizadas.map(os => os.toJSON())
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao consultar O.S por assunto: ' + error.message);
    }
  }

  private validarPeriodo(dataInicio: string, dataFim: string): void {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException('Datas inválidas');
    }

    if (inicio > fim) {
      throw new BadRequestException('Data de início deve ser menor que a data de fim');
    }

    const hoje = new Date();
    if (fim > hoje) {
      throw new BadRequestException('Data de fim não pode ser no futuro');
    }
  }
}
