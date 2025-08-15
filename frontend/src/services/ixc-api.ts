import axios from 'axios';

// Interface para os parâmetros de grid da API IXC
interface IXCGridParam {
  TB: string;
  OP: string;
  P: string;
  P2?: string;
}

// Interface para consulta de O.S
interface OSConsultaPayload {
  grid_param: string;
}

// Interface para consulta por ID
interface ConsultaPorIdPayload {
  qtype: string;
  query: string;
  oper: string;
  page: string;
  op: string;
}

// Interfaces de resposta
export interface OSResponse {
  total: number;
  registros: Array<{
    id: string;
    id_cliente?: string;
    id_assunto?: string;
    setor?: string;
    id_cidade?: string;
    id_tecnico?: string;
  }>;
}

export interface AssuntoResponse {
  page: string;
  total: string;
  registros: Array<{
    id: string;
    assunto: string;
  }>;
}

export interface CidadeResponse {
  page: string;
  total: string;
  registros: Array<{
    id: string;
    nome: string;
  }>;
}

export interface ColaboradorResponse {
  page: string;
  total: string;
  registros: Array<{
    id: string;
    funcionario: string;
  }>;
}

class IXCApiService {
  private baseURL: string;
  private token: string;
  private api: any;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_IXC_API_URL || 'https://crm.tubaron.net/webservice/v1';
    this.token = process.env.NEXT_PUBLIC_IXC_TOKEN || 'token';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.token}`,
        'ixcsoft': 'listar',
      },
    });
  }

  // Método para criar parâmetros de grid
  private createGridParam(params: IXCGridParam[]): string {
    return JSON.stringify(params);
  }

  // O.S Por assunto
  async getOSPorAssunto(
    assuntoIds: string[],
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const gridParams: IXCGridParam[] = [
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
        TB: "su_oss_chamado.data_abertura",
        OP: "BE",
        P: dataInicio,
        P2: dataFim
      }
    ];

    const payload: OSConsultaPayload = {
      grid_param: this.createGridParam(gridParams)
    };

    const response = await this.api.post('/su_oss_chamado', payload);
     return response.data;
  }

  // O.S Por setor
  async getOSPorSetor(
    setorId: string,
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const gridParams: IXCGridParam[] = [
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
        TB: "su_oss_chamado.data_abertura",
        OP: "BE",
        P: dataInicio,
        P2: dataFim
      }
    ];

    const payload: OSConsultaPayload = {
      grid_param: this.createGridParam(gridParams)
    };

    console.log(payload)
    const response = await this.api.post('/su_oss_chamado', payload);
    return response.data;
  }

  // O.S Por colaborador
  async getOSPorColaborador(
    tecnicoIds: string[],
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const gridParams: IXCGridParam[] = [
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
        TB: "su_oss_chamado.data_abertura",
        OP: "BE",
        P: dataInicio,
        P2: dataFim
      }
    ];

    const payload: OSConsultaPayload = {
      grid_param: this.createGridParam(gridParams)
    };

    const response = await this.api.post('/su_oss_chamado', payload);
    return response.data;
  }

  // O.S Por cidade
  async getOSPorCidade(
    cidadeIds: string[],
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const gridParams: IXCGridParam[] = [
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
        TB: "su_oss_chamado.data_abertura",
        OP: "BE",
        P: dataInicio,
        P2: dataFim
      }
    ];

    const payload: OSConsultaPayload = {
      grid_param: this.createGridParam(gridParams)
    };

    const response = await this.api.post('/su_oss_chamado', payload);
    return response.data;
  }

  // Assunto por ID
  async getAssuntoPorId(assuntoIds: string[]): Promise<AssuntoResponse> {
    const payload: ConsultaPorIdPayload = {
      qtype: "su_oss_assunto.id",
      query: assuntoIds.join(','),
      oper: "IN",
      page: "1",
      op: "20"
    };

    const response = await this.api.post('/su_oss_assunto', payload);
    return response.data;
  }

  // Cidade por ID
  async getCidadePorId(cidadeIds: string[]): Promise<CidadeResponse> {
    const payload: ConsultaPorIdPayload = {
      qtype: "cidade.id",
      query: cidadeIds.join(','),
      oper: "IN",
      page: "1",
      op: "20"
    };

    const response = await this.api.post('/cidade', payload);
    return response.data;
  }

  // Colaborador por ID
  async getColaboradorPorId(funcionarioIds: string[]): Promise<ColaboradorResponse> {
    const payload: ConsultaPorIdPayload = {
      qtype: "funcionarios.id",
      query: funcionarioIds.join(','),
      oper: "IN",
      page: "1",
      op: "20"
    };

    const response = await this.api.post('/funcionarios', payload);
    return response.data;
  }

  // Método auxiliar para obter dados completos do dashboard
  async getDashboardData(
    dataInicio: string,
    dataFim: string,
    colaboradorIds?: string[]
  ) {
    try {
      // Primeiro, obter dados do setor para extrair os IDs necessários
      const osSetor = await this.getOSPorSetor("1", dataInicio, dataFim);
      
      // Extrair IDs únicos
      const assuntoIds = [...new Set(osSetor.registros.map(os => os.id_assunto).filter(Boolean))] as string[];
      const cidadeIds = [...new Set(osSetor.registros.map(os => os.id_cidade).filter(Boolean))] as string[];
      const tecnicoIds = colaboradorIds && colaboradorIds.length > 0 
        ? colaboradorIds 
        : [...new Set(osSetor.registros.map(os => os.id_tecnico).filter(Boolean))] as string[];

      // Consultas paralelas para obter dados completos
      const [
        osAssunto,
        osColaborador,
        osCidade,
        assuntos,
        cidades,
        colaboradores
      ] = await Promise.all([
        this.getOSPorAssunto(assuntoIds, dataInicio, dataFim),
        this.getOSPorColaborador(tecnicoIds, dataInicio, dataFim),
        this.getOSPorCidade(cidadeIds, dataInicio, dataFim),
        this.getAssuntoPorId(assuntoIds),
        this.getCidadePorId(cidadeIds),
        this.getColaboradorPorId(tecnicoIds)
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
      throw error;
    }
  }
}

export const ixcApiService = new IXCApiService();
