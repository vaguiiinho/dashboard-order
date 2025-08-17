import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IIXCRepository } from './ixc.repository.interface';

@Injectable()
export class IXCRepository implements IIXCRepository {
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
      timeout: 30000,
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
  private createGridParam(params: any[]): string {
    return JSON.stringify(params);
  }

  // Consultas de O.S
  async consultarOSPorAssunto(assuntoIds: string[], dataInicio: string, dataFim: string): Promise<any> {
    try {
      const gridParams = [
        {
          TB: "su_oss_chamado.id_assunto",
          OP: "IN",
          P: assuntoIds.join(',')
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dataInicio,
          P2: dataFim
        }
      ];

      const payload = {
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

  async consultarOSPorSetor(setorId: string, dataInicio: string, dataFim: string): Promise<any> {
    try {
      const gridParams = [
        {
          TB: "su_oss_chamado.setor",
          OP: "=",
          P: setorId
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dataInicio,
          P2: dataFim
        }
      ];

      const payload = {
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

  async consultarOSPorColaborador(tecnicoIds: string[], dataInicio: string, dataFim: string): Promise<any> {
    try {
      const gridParams = [
        {
          TB: "su_oss_chamado.id_tecnico",
          OP: "IN",
          P: tecnicoIds.join(',')
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dataInicio,
          P2: dataFim
        }
      ];

      const payload = {
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

  async consultarOSPorCidade(cidadeIds: string[], dataInicio: string, dataFim: string): Promise<any> {
    try {
      const gridParams = [
        {
          TB: "su_oss_chamado.id_cidade",
          OP: "IN",
          P: cidadeIds.join(',')
        },
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dataInicio,
          P2: dataFim
        }
      ];

      const payload = {
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

  // Consultas auxiliares
  async consultarAssuntosPorIds(assuntoIds: string[]): Promise<any> {
    try {
      const payload = {
        qtype: "su_oss_assunto.id",
        query: assuntoIds.join(','),
        oper: "=",
        page: "1",
        op: "list"
      };

      const response = await this.api.post('/su_oss_assunto', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar assuntos',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async consultarCidadesPorIds(cidadeIds: string[]): Promise<any> {
    try {
      const payload = {
        qtype: "cidade.id",
        query: cidadeIds.join(','),
        oper: "=",
        page: "1",
        op: "list"
      };

      const response = await this.api.post('/cidade', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar cidades',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async consultarColaboradoresPorIds(funcionarioIds: string[]): Promise<any> {
    try {
      const payload = {
        qtype: "funcionarios.id",
        query: funcionarioIds.join(','),
        oper: "=",
        page: "1",
        op: "list"
      };

      const response = await this.api.post('/funcionarios', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar colaboradores',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Consultas de listagem
  async listarAssuntos(): Promise<any> {
    try {
      const payload = {
        qtype: "",
        query: "",
        oper: "",
        page: "1",
        op: "list"
      };

      const response = await this.api.post('/su_oss_assunto', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao listar assuntos',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async listarCidades(): Promise<any> {
    try {
      const payload = {
        qtype: "",
        query: "",
        oper: "",
        page: "1",
        op: "list"
      };

      const response = await this.api.post('/cidade', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao listar cidades',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async listarColaboradores(): Promise<any> {
    try {
      const payload = {
        qtype: "",
        query: "",
        oper: "",
        page: "1",
        op: "list"
      };

      const response = await this.api.post('/funcionarios', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao listar colaboradores',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Dashboard
  async obterDadosDashboard(dataInicio: string, dataFim: string): Promise<any> {
    try {
      // Consultar todas as O.S no período
      const gridParams = [
        {
          TB: "su_oss_chamado.status",
          OP: "=",
          P: "F"
        },
        {
          TB: "su_oss_chamado.data_agenda",
          OP: "BE",
          P: dataInicio,
          P2: dataFim
        }
      ];

      const payload = {
        grid_param: this.createGridParam(gridParams)
      };

      const response = await this.api.post('/su_oss_chamado', payload);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Erro ao obter dados do dashboard',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
