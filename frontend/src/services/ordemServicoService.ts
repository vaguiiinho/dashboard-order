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

export interface Cidade {
  id: string;
  nome: string;
  estado: string;
  ativo: boolean;
}

export interface RegistroOS {
  id?: string;
  setor: string;
  colaborador: string;
  tipoAtividade: string;
  cidade: string;
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
  cidade: Cidade;
}

export interface RelatorioResponse {
  totalGeral: number;
  totalPorSetor: Record<string, number>;
  totalPorColaborador: Record<string, number>;
  totalPorTipo: Record<string, number>;
  totalPorCidade: Record<string, number>;
  registros: RegistroOSResponse[];
}

class OrdemServicoService {
  // Buscar todos os setores
  async getSetores(): Promise<Setor[]> {
    const response = await api.get<Setor[]>('/setores');
    return response.data;
  }

  // Criar setor
  async createSetor(payload: { nome: string; ativo?: boolean }): Promise<Setor> {
    const response = await api.post<Setor>('/setores', payload);
    return response.data;
  }

  // Buscar colaboradores por setor
  async getColaboradores(setor: string): Promise<Colaborador[]> {
    const response = await api.get<Colaborador[]>('/colaboradores', {
      params: { setor },
    });
    return response.data;
  }

  // Criar colaborador
  async createColaborador(payload: { nome: string; setorId: string; ativo?: boolean }): Promise<Colaborador> {
    const response = await api.post<Colaborador>('/colaboradores', payload);
    return response.data;
  }

  // Buscar tipos de atividade por setor
  async getTiposAtividade(setor: string): Promise<TipoAtividade[]> {
    const response = await api.get<TipoAtividade[]>('/tipos-atividade', {
      params: { setor },
    });
    return response.data;
  }

  // Criar tipo de atividade
  async createTipoAtividade(payload: { nome: string; setorId: string; ativo?: boolean }): Promise<TipoAtividade> {
    const response = await api.post<TipoAtividade>('/tipos-atividade', payload);
    return response.data;
  }

  // Buscar todas as cidades
  async getCidades(): Promise<Cidade[]> {
    const response = await api.get<Cidade[]>('/registros-os/cidades');
    return response.data;
  }

  // Criar cidade
  async createCidade(payload: { nome: string; estado: string; ativo?: boolean }): Promise<Cidade> {
    const response = await api.post<Cidade>('/cidades', payload);
    return response.data;
  }

  // Criar um único registro
  async createRegistro(registro: RegistroOS): Promise<RegistroOSResponse> {
    const response = await api.post<RegistroOSResponse>('/registros-os', registro);
    return response.data;
  }

  // Criar múltiplos registros
  async createMultipleRegistros(registros: RegistroOS[]): Promise<RegistroOSResponse[]> {
    const response = await api.post<RegistroOSResponse[]>('/registros-os/batch', {
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
    const response = await api.get<RegistroOSResponse[]>('/registros-os', {
      params: filters,
    });
    return response.data;
  }

  // Gerar relatório
  async getRelatorio(filters?: {
    mes?: string;
    ano?: string;
  }): Promise<RelatorioResponse> {
    const response = await api.get<RelatorioResponse>('/registros-os/relatorio', {
      params: filters,
    });
    return response.data;
  }

  // Deletar um registro
  async deleteRegistro(id: string): Promise<void> {
    await api.delete(`/registros-os/${id}`);
  }
}

export const ordemServicoService = new OrdemServicoService();

