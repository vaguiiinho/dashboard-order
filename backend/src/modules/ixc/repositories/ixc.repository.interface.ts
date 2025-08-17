export interface IIXCRepository {
  // Consultas de O.S
  consultarOSPorAssunto(assuntoIds: string[], dataInicio: string, dataFim: string): Promise<any>;
  consultarOSPorSetor(setorId: string, dataInicio: string, dataFim: string): Promise<any>;
  consultarOSPorColaborador(tecnicoIds: string[], dataInicio: string, dataFim: string): Promise<any>;
  consultarOSPorCidade(cidadeIds: string[], dataInicio: string, dataFim: string): Promise<any>;
  
  // Consultas auxiliares
  consultarAssuntosPorIds(assuntoIds: string[]): Promise<any>;
  consultarCidadesPorIds(cidadeIds: string[]): Promise<any>;
  consultarColaboradoresPorIds(funcionarioIds: string[]): Promise<any>;
  
  // Consultas de listagem
  listarAssuntos(): Promise<any>;
  listarCidades(): Promise<any>;
  listarColaboradores(): Promise<any>;
  
  // Dashboard
  obterDadosDashboard(dataInicio: string, dataFim: string): Promise<any>;
}
