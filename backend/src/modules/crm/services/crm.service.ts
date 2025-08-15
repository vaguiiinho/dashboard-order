import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  IXCGridParam,
  OSConsultaPayload,
  ConsultaPorIdPayload,
  OSResponse,
  AssuntoResponse,
  CidadeResponse,
  ColaboradorResponse,
  OSPorAssuntoDto,
  OSPorSetorDto,
  OSPorColaboradorDto,
  OSPorCidadeDto,
  AssuntoPorIdDto,
  CidadePorIdDto,
  ColaboradorPorIdDto,
  DashboardDataDto,
} from '../interfaces/crm.interfaces';

@Injectable()
export class CrmService {
  private api: AxiosInstance;
  private baseURL: string;
  private token: string;

  constructor() {
    this.baseURL = process.env.IXC_API_URL || 'https://crm.tubaron.net/webservice/v1';
    this.token = process.env.IXC_TOKEN || 'token';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(this.token).toString('base64')}`,
        'ixcsoft': 'listar',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Interceptor para logging de erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Erro na API IXC:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  // Método para criar parâmetros de grid
  private createGridParam(params: IXCGridParam[]): string {
    return JSON.stringify(params);
  }

  // O.S Por assunto
  async getOSPorAssunto(dto: OSPorAssuntoDto): Promise<OSResponse> {
    try {
      const gridParams: IXCGridParam[] = [
        {
          TB: "su_oss_chamado.id_assunto",
          OP: "IN",
          P: dto.assuntoIds.join(',')
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dto.dataInicio,
          P2: dto.dataFim
        }
      ];

      const payload: OSConsultaPayload = {
        grid_param: this.createGridParam(gridParams)
      };

      const response = await this.api.post('/su_oss_chamado', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar O.S por assunto',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // O.S Por setor
  async getOSPorSetor(dto: OSPorSetorDto): Promise<OSResponse> {
    try {
      const gridParams: IXCGridParam[] = [
        {
          TB: "su_oss_chamado.setor",
          OP: "=",
          P: dto.setorId
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dto.dataInicio,
          P2: dto.dataFim
        }
      ];

      const payload: OSConsultaPayload = {
        grid_param: this.createGridParam(gridParams)
      };

      const response = await this.api.post('/su_oss_chamado', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar O.S por setor',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // O.S Por colaborador
  async getOSPorColaborador(dto: OSPorColaboradorDto): Promise<OSResponse> {
    try {
      const gridParams: IXCGridParam[] = [
        {
          TB: "su_oss_chamado.id_tecnico",
          OP: "IN",
          P: dto.tecnicoIds.join(',')
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dto.dataInicio,
          P2: dto.dataFim
        }
      ];

      const payload: OSConsultaPayload = {
        grid_param: this.createGridParam(gridParams)
      };

      const response = await this.api.post('/su_oss_chamado', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar O.S por colaborador',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // O.S Por cidade
  async getOSPorCidade(dto: OSPorCidadeDto): Promise<OSResponse> {
    try {
      const gridParams: IXCGridParam[] = [
        {
          TB: "su_oss_chamado.id_cidade",
          OP: "IN",
          P: dto.cidadeIds.join(',')
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dto.dataInicio,
          P2: dto.dataFim
        }
      ];

      const payload: OSConsultaPayload = {
        grid_param: this.createGridParam(gridParams)
      };

      const response = await this.api.post('/su_oss_chamado', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar O.S por cidade',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Assunto por ID
  async getAssuntoPorId(dto: AssuntoPorIdDto): Promise<AssuntoResponse> {
    try {
      const payload: ConsultaPorIdPayload = {
        qtype: "su_oss_assunto.id",
        query: dto.assuntoIds.join(','),
        oper: "IN",
        page: "1",
        op: "20"
      };

      const response = await this.api.post('/su_oss_assunto', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar assunto por ID',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Cidade por ID
  async getCidadePorId(dto: CidadePorIdDto): Promise<CidadeResponse> {
    try {
      const payload: ConsultaPorIdPayload = {
        qtype: "cidade.id",
        query: dto.cidadeIds.join(','),
        oper: "IN",
        page: "1",
        op: "20"
      };

      const response = await this.api.post('/cidade', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar cidade por ID',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Colaborador por ID
  async getColaboradorPorId(dto: ColaboradorPorIdDto): Promise<ColaboradorResponse> {
    try {
      const payload: ConsultaPorIdPayload = {
        qtype: "funcionarios.id",
        query: dto.funcionarioIds.toString(),
        oper: "IN",
        page: "1",
        op: "20"
      };
      const response = await this.api.post('/funcionarios', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar colaborador por ID',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Método auxiliar para obter dados completos do dashboard
  async getDashboardData(dto: DashboardDataDto) {
    try {
      // Primeiro, obter dados do setor para extrair os IDs necessários
      const osSetor = await this.getOSPorSetor({
        setorId: "1",
        dataInicio: dto.dataInicio,
        dataFim: dto.dataFim
      });
      
      // Extrair IDs únicos
      const assuntoIds = [...new Set(osSetor.registros.map(os => os.id_assunto).filter(Boolean))] as string[];
      const cidadeIds = [...new Set(osSetor.registros.map(os => os.id_cidade).filter(Boolean))] as string[];
      const tecnicoIds = dto.colaboradorIds && dto.colaboradorIds.length > 0 
        ? dto.colaboradorIds 
        : [...new Set(osSetor.registros.map(os => os.id_tecnico).filter(Boolean))] as string[];

      // Verificar se existem dados para consultar
      if (assuntoIds.length === 0 || cidadeIds.length === 0 || tecnicoIds.length === 0) {
        return {
          osSetor,
          osAssunto: { total: 0, registros: [] },
          osColaborador: { total: 0, registros: [] },
          osCidade: { total: 0, registros: [] },
          assuntos: { page: "1", total: "0", registros: [] },
          cidades: { page: "1", total: "0", registros: [] },
          colaboradores: { page: "1", total: "0", registros: [] }
        };
      }

      // Consultas paralelas para obter dados completos
      const [
        osAssunto,
        osColaborador,
        osCidade,
        assuntos,
        cidades,
        colaboradores
      ] = await Promise.all([
        assuntoIds.length > 0 ? this.getOSPorAssunto({ assuntoIds, dataInicio: dto.dataInicio, dataFim: dto.dataFim }) : Promise.resolve({ total: 0, registros: [] }),
        tecnicoIds.length > 0 ? this.getOSPorColaborador({ tecnicoIds, dataInicio: dto.dataInicio, dataFim: dto.dataFim }) : Promise.resolve({ total: 0, registros: [] }),
        cidadeIds.length > 0 ? this.getOSPorCidade({ cidadeIds, dataInicio: dto.dataInicio, dataFim: dto.dataFim }) : Promise.resolve({ total: 0, registros: [] }),
        assuntoIds.length > 0 ? this.getAssuntoPorId({ assuntoIds }) : Promise.resolve({ page: "1", total: "0", registros: [] }),
        cidadeIds.length > 0 ? this.getCidadePorId({ cidadeIds }) : Promise.resolve({ page: "1", total: "0", registros: [] }),
        tecnicoIds.length > 0 ? this.getColaboradorPorId({ funcionarioIds: tecnicoIds }) : Promise.resolve({ page: "1", total: "0", registros: [] })
      ]);

      return {
        osSetor,
        osAssunto,
        osColaborador,
        osCidade,
        assuntos,
        cidades,
        colaboradores
      };
    } catch (error) {
      console.error('Erro ao obter dados do dashboard:', error);
      throw new HttpException(
        'Erro ao obter dados do dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
