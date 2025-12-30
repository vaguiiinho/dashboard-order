export class OrdemServico {
  private _id: string;
  private _idCliente: string;
  private _idAssunto: string;
  private _setor: string;
  private _idCidade: string;
  private _idTecnico: string;
  private _status: string;
  private _dataAgenda: Date;
  private _dataCriacao: Date;
  private _dataFinalizacao?: Date;

  constructor(
    id: string,
    idCliente: string,
    idAssunto: string,
    setor: string,
    idCidade: string,
    idTecnico: string,
    status: string,
    dataAgenda: Date,
    dataCriacao: Date,
    dataFinalizacao?: Date
  ) {
    this.validarId(id);
    this.validarStatus(status);
    this.validarDataAgenda(dataAgenda);

    this._id = id;
    this._idCliente = idCliente;
    this._idAssunto = idAssunto;
    this._setor = setor;
    this._idCidade = idCidade;
    this._idTecnico = idTecnico;
    this._status = status;
    this._dataAgenda = dataAgenda;
    this._dataCriacao = dataCriacao;
    this._dataFinalizacao = dataFinalizacao;
  }

  // Getters
  get id(): string { return this._id; }
  get idCliente(): string { return this._idCliente; }
  get idAssunto(): string { return this._idAssunto; }
  get setor(): string { return this._setor; }
  get idCidade(): string { return this._idCidade; }
  get idTecnico(): string { return this._idTecnico; }
  get status(): string { return this._status; }
  get dataAgenda(): Date { return this._dataAgenda; }
  get dataCriacao(): Date { return this._dataCriacao; }
  get dataFinalizacao(): Date | undefined { return this._dataFinalizacao; }

  // Validações privadas
  private validarId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('ID da O.S é obrigatório');
    }
  }

  private validarStatus(status: string): void {
    const statusValidos = ['A', 'F', 'C']; // Aberta, Finalizada, Cancelada
    if (!statusValidos.includes(status)) {
      throw new Error('Status deve ser A (Aberta), F (Finalizada) ou C (Cancelada)');
    }
  }

  private validarDataAgenda(dataAgenda: Date): void {
    if (!dataAgenda || !(dataAgenda instanceof Date) || isNaN(dataAgenda.getTime())) {
      throw new Error('Data de agenda deve ser uma data válida');
    }
  }

  // Comportamentos
  finalizar(): void {
    if (this._status === 'F') {
      throw new Error('O.S já está finalizada');
    }
    if (this._status === 'C') {
      throw new Error('O.S cancelada não pode ser finalizada');
    }
    
    this._status = 'F';
    this._dataFinalizacao = new Date();
  }

  cancelar(): void {
    if (this._status === 'F') {
      throw new Error('O.S finalizada não pode ser cancelada');
    }
    if (this._status === 'C') {
      throw new Error('O.S já está cancelada');
    }
    
    this._status = 'C';
  }

  reagendar(novaData: Date): void {
    this.validarDataAgenda(novaData);
    this._dataAgenda = novaData;
  }

  // Métodos de consulta
  isFinalizada(): boolean {
    return this._status === 'F';
  }

  isCancelada(): boolean {
    return this._status === 'C';
  }

  isAberta(): boolean {
    return this._status === 'A';
  }

  // Método para serializar a entidade
  toJSON() {
    return {
      id: this._id,
      idCliente: this._idCliente,
      idAssunto: this._idAssunto,
      setor: this._setor,
      idCidade: this._idCidade,
      idTecnico: this._idTecnico,
      status: this._status,
      dataAgenda: this._dataAgenda,
      dataCriacao: this._dataCriacao,
      dataFinalizacao: this._dataFinalizacao
    };
  }

  // Método para criar uma instância a partir de dados
  static fromData(data: any): OrdemServico {
    return new OrdemServico(
      data.id,
      data.id_cliente || data.idCliente || '',
      data.id_assunto || data.idAssunto || '',
      data.setor || '',
      data.id_cidade || data.idCidade || '',
      data.id_tecnico || data.idTecnico || '',
      data.status || 'A',
      data.data_agenda ? new Date(data.data_agenda) : new Date(),
      data.data_criacao ? new Date(data.data_criacao) : new Date(),
      data.data_finalizacao ? new Date(data.data_finalizacao) : undefined
    );
  }
}
