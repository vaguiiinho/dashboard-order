import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { PrismaService } from '../../config/prisma.service';
import { UsuarioRepository } from './repositories/usuario.repository';
import { CriarUsuarioUseCase } from './use-cases/criar-usuario.use-case';
import { ListarUsuariosUseCase } from './use-cases/listar-usuarios.use-case';
import { BuscarUsuarioPorIdUseCase } from './use-cases/buscar-usuario-por-id.use-case';
import { CriarGrupoUseCase } from './use-cases/criar-grupo.use-case';
import { IUsuarioRepository } from './repositories/usuario.repository.interface';

@Module({
  controllers: [UsuariosController],
  providers: [
    PrismaService,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioRepository,
    },
    {
      provide: CriarUsuarioUseCase,
      useFactory: (repository: IUsuarioRepository) => new CriarUsuarioUseCase(repository),
      inject: ['IUsuarioRepository'],
    },
    {
      provide: ListarUsuariosUseCase,
      useFactory: (repository: IUsuarioRepository) => new ListarUsuariosUseCase(repository),
      inject: ['IUsuarioRepository'],
    },
    {
      provide: BuscarUsuarioPorIdUseCase,
      useFactory: (repository: IUsuarioRepository) => new BuscarUsuarioPorIdUseCase(repository),
      inject: ['IUsuarioRepository'],
    },
    {
      provide: CriarGrupoUseCase,
      useFactory: (repository: IUsuarioRepository) => new CriarGrupoUseCase(repository),
      inject: ['IUsuarioRepository'],
    },
  ],
  exports: ['IUsuarioRepository'],
})
export class UsuariosModule {}

