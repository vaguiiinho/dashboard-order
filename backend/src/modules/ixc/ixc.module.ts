import { Module } from '@nestjs/common';
import { IXCController } from './controllers/ixc.controller';
import { IIXCRepository } from './repositories/ixc.repository.interface';
import { IXCRepository } from './repositories/ixc.repository';
import { ConsultarOSPorAssuntoUseCase } from './use-cases/consultar-os-por-assunto.use-case';

@Module({
  controllers: [IXCController],
  providers: [
    {
      provide: 'IIXCRepository',
      useClass: IXCRepository,
    },
    {
      provide: ConsultarOSPorAssuntoUseCase,
      useFactory: (repository: IIXCRepository) => new ConsultarOSPorAssuntoUseCase(repository),
      inject: ['IIXCRepository'],
    },
  ],
  exports: ['IIXCRepository'],
})
export class IXCModule {}
