export class OrdemServicoResponseDto {
  id: string;
  idCliente: string;
  idAssunto: string;
  setor: string;
  idCidade: string;
  idTecnico: string;
  status: string;
  dataAgenda: Date;
  dataCriacao: Date;
  dataFinalizacao?: Date;

  constructor(data: any) {
    this.id = data.id;
    this.idCliente = data.idCliente || data.id_cliente || '';
    this.idAssunto = data.idAssunto || data.id_assunto || '';
    this.setor = data.setor || '';
    this.idCidade = data.idCidade || data.id_cidade || '';
    this.idTecnico = data.idTecnico || data.id_tecnico || '';
    this.status = data.status || 'A';
    this.dataAgenda = data.dataAgenda || data.data_agenda ? new Date(data.dataAgenda || data.data_agenda) : new Date();
    this.dataCriacao = data.dataCriacao || data.data_criacao ? new Date(data.dataCriacao || data.data_criacao) : new Date();
    this.dataFinalizacao = data.dataFinalizacao || data.data_finalizacao ? new Date(data.dataFinalizacao || data.data_finalizacao) : undefined;
  }
}

export class AssuntoResponseDto {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.assunto || data.nome || '';
    this.descricao = data.descricao;
    this.ativo = data.ativo !== false;
  }
}

export class CidadeResponseDto {
  id: string;
  nome: string;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.nome || '';
  }
}

export class ColaboradorResponseDto {
  id: string;
  nome: string;

  constructor(data: any) {
    this.id = data.id;
    this.nome = data.funcionario || data.nome || '';
  }
}

export class ListaOSResponseDto {
  total: number;
  registros: OrdemServicoResponseDto[];

  constructor(total: number, registros: any[]) {
    this.total = total;
    this.registros = registros.map(r => new OrdemServicoResponseDto(r));
  }
}

export class ListaAssuntosResponseDto {
  total: number;
  registros: AssuntoResponseDto[];

  constructor(total: number, registros: any[]) {
    this.total = total;
    this.registros = registros.map(r => new AssuntoResponseDto(r));
  }
}

export class ListaCidadesResponseDto {
  total: number;
  registros: CidadeResponseDto[];

  constructor(total: number, registros: any[]) {
    this.total = total;
    this.registros = registros.map(r => new CidadeResponseDto(r));
  }
}

export class ListaColaboradoresResponseDto {
  total: number;
  registros: ColaboradorResponseDto[];

  constructor(total: number, registros: any[]) {
    this.total = total;
    this.registros = registros.map(r => new ColaboradorResponseDto(r));
  }
}

export class DashboardDataResponseDto {
  totalOS: number;
  osPorAssunto: Array<{ assunto: string; quantidade: number }>;
  osPorCidade: Array<{ cidade: string; quantidade: number }>;
  osPorColaborador: Array<{ colaborador: string; quantidade: number }>;
  periodo: { inicio: string; fim: string };

  constructor(
    totalOS: number,
    osPorAssunto: Array<{ assunto: string; quantidade: number }>,
    osPorCidade: Array<{ cidade: string; quantidade: number }>,
    osPorColaborador: Array<{ colaborador: string; quantidade: number }>,
    periodo: { inicio: string; fim: string }
  ) {
    this.totalOS = totalOS;
    this.osPorAssunto = osPorAssunto;
    this.osPorCidade = osPorCidade;
    this.osPorColaborador = osPorColaborador;
    this.periodo = periodo;
  }
}
