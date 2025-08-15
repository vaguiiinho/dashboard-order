import { api } from './api';

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

// DTOs para requisições
interface OSPorAssuntoDto {
  assuntoIds: string[];
  dataInicio: string;
  dataFim: string;
}

interface OSPorSetorDto {
  setorId: string;
  dataInicio: string;
  dataFim: string;
}

interface OSPorColaboradorDto {
  tecnicoIds: string[];
  dataInicio: string;
  dataFim: string;
}

interface OSPorCidadeDto {
  cidadeIds: string[];
  dataInicio: string;
  dataFim: string;
}

interface AssuntoPorIdDto {
  assuntoIds: string[];
}

interface CidadePorIdDto {
  cidadeIds: string[];
}

interface ColaboradorPorIdDto {
  funcionarioIds: string[];
}

interface DashboardDataDto {
  dataInicio: string;
  dataFim: string;
  colaboradorIds?: string[];
}

class IXCApiService {
  constructor() {
    // Não precisamos mais configurar axios aqui, usaremos o api service existente
  }

  // O.S Por assunto
  async getOSPorAssunto(
    assuntoIds: string[],
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const dto: OSPorAssuntoDto = {
      assuntoIds,
      dataInicio,
      dataFim
    };

    const response = await api.post('/crm/os-por-assunto', dto);
    return response.data;
  }

  // O.S Por setor
  async getOSPorSetor(
    setorId: string,
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const dto: OSPorSetorDto = {
      setorId,
      dataInicio,
      dataFim
    };

    const response = await api.post('/crm/os-por-setor', dto);
    return response.data;
  }

  // O.S Por colaborador
  async getOSPorColaborador(
    tecnicoIds: string[],
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const dto: OSPorColaboradorDto = {
      tecnicoIds,
      dataInicio,
      dataFim
    };

    const response = await api.post('/crm/os-por-colaborador', dto);
    return response.data;
  }

  // O.S Por cidade
  async getOSPorCidade(
    cidadeIds: string[],
    dataInicio: string,
    dataFim: string
  ): Promise<OSResponse> {
    const dto: OSPorCidadeDto = {
      cidadeIds,
      dataInicio,
      dataFim
    };

    const response = await api.post('/crm/os-por-cidade', dto);
    return response.data;
  }

  // Assunto por ID
  async getAssuntoPorId(assuntoIds: string[]): Promise<AssuntoResponse> {
    const dto: AssuntoPorIdDto = {
      assuntoIds
    };

    const response = await api.post('/crm/assunto-por-id', dto);
    return response.data;
  }

  // Cidade por ID
  async getCidadePorId(cidadeIds: string[]): Promise<CidadeResponse> {
    const dto: CidadePorIdDto = {
      cidadeIds
    };

    const response = await api.post('/crm/cidade-por-id', dto);
    return response.data;
  }

  // Colaborador por ID
  async getColaboradorPorId(funcionarioIds: string[]): Promise<ColaboradorResponse> {
    const dto: ColaboradorPorIdDto = {
      funcionarioIds
    };

    const response = await api.post('/crm/colaborador-por-id', dto);
    return response.data;
  }

  // Método auxiliar para obter dados completos do dashboard
  async getDashboardData(
    dataInicio: string,
    dataFim: string,
    colaboradorIds?: string[]
  ) {
    try {
      const dto: DashboardDataDto = {
        dataInicio,
        dataFim,
        colaboradorIds
      };

      const response = await api.post('/crm/dashboard-data', dto);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados do dashboard:', error);
      throw error;
    }
  }
}

export const ixcApiService = new IXCApiService();
