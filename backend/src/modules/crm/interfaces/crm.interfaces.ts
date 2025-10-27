// Interface para os parâmetros de grid da API IXC
export interface IXCGridParam {
  TB: string;
  OP: string;
  P: string;
  P2?: string;
}

// Interface para consulta de O.S
export interface OSConsultaPayload {
  grid_param: string;
  rp?: string;
}

// Interface para consulta por ID
export interface ConsultaPorIdPayload {
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

// DTOs para requisições
export interface OSPorAssuntoDto {
  assuntoIds: string[];
  dataInicio: string;
  dataFim: string;
}

export interface OSPorSetorDto {
  setorId: string;
  dataInicio: string;
  dataFim: string;
}

export interface OSPorColaboradorDto {
  tecnicoIds: string[];
  dataInicio: string;
  dataFim: string;
}

export interface OSPorCidadeDto {
  cidadeIds: string[];
  dataInicio: string;
  dataFim: string;
}

export interface AssuntoPorIdDto {
  assuntoIds: string[];
}

export interface CidadePorIdDto {
  cidadeIds: string[];
}

export interface ColaboradorPorIdDto {
  funcionarioIds: string[];
}

export interface DashboardDataDto {
  dataInicio: string;
  dataFim: string;
  colaboradorIds?: string[];
}
