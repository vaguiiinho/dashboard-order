import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Setor {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface Colaborador {
  id: string;
  nome: string;
  setorId: string;
  ativo: boolean;
}

export interface TipoAtividade {
  id: string;
  nome: string;
  setorId: string;
  ativo: boolean;
}

export interface RegistroOS {
  id?: string;
  setor: string;
  colaborador: string;
  tipoAtividade: string;
  quantidade: number;
  mes: string;
  ano: string;
  observacoes?: string;
}

export interface RegistroOSResponse {
  id: string;
  setorId: string;
  colaboradorId: string;
  tipoAtividadeId: string;
  quantidade: number;
  mes: string;
  ano: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  setor: Setor;
  colaborador: Colaborador;
  tipoAtividade: TipoAtividade;
}

export interface RelatorioResponse {
  totalGeral: number;
  totalPorSetor: Record<string, number>;
  totalPorColaborador: Record<string, number>;
  totalPorTipo: Record<string, number>;
  registros: RegistroOSResponse[];
}

class OrdemServicoService {
  // Buscar todos os setores
  async getSetores(): Promise<Setor[]> {
    const response = await api.get<Setor[]>('/ordem-servico/setores');
    return response.data;
  }

  // Buscar colaboradores por setor
  async getColaboradores(setor: string): Promise<Colaborador[]> {
    const response = await api.get<Colaborador[]>('/ordem-servico/colaboradores', {
      params: { setor },
    });
    return response.data;
  }

  // Buscar tipos de atividade por setor
  async getTiposAtividade(setor: string): Promise<TipoAtividade[]> {
    const response = await api.get<TipoAtividade[]>('/ordem-servico/tipos-atividade', {
      params: { setor },
    });
    return response.data;
  }

  // Criar um único registro
  async createRegistro(registro: RegistroOS): Promise<RegistroOSResponse> {
    const response = await api.post<RegistroOSResponse>('/ordem-servico/registro', registro);
    return response.data;
  }

  // Criar múltiplos registros
  async createMultipleRegistros(registros: RegistroOS[]): Promise<RegistroOSResponse[]> {
    const response = await api.post<RegistroOSResponse[]>('/ordem-servico/registros', {
      registros,
    });
    return response.data;
  }

  // Buscar todos os registros
  async getAllRegistros(filters?: {
    mes?: string;
    ano?: string;
    setor?: string;
  }): Promise<RegistroOSResponse[]> {
    const response = await api.get<RegistroOSResponse[]>('/ordem-servico/registros', {
      params: filters,
    });
    return response.data;
  }

  // Gerar relatório
  async getRelatorio(filters?: {
    mes?: string;
    ano?: string;
  }): Promise<RelatorioResponse> {
    const response = await api.get<RelatorioResponse>('/ordem-servico/relatorio', {
      params: filters,
    });
    return response.data;
  }

  // Deletar um registro
  async deleteRegistro(id: string): Promise<void> {
    await api.delete(`/ordem-servico/registro/${id}`);
  }
}

export const ordemServicoService = new OrdemServicoService();

