import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';
import { CriarUsuarioUseCase } from '../use-cases/criar-usuario.use-case';
import { ListarUsuariosUseCase } from '../use-cases/listar-usuarios.use-case';
import { BuscarUsuarioPorIdUseCase } from '../use-cases/buscar-usuario-por-id.use-case';
import { AtualizarUsuarioUseCase } from '../use-cases/atualizar-usuario.use-case';
import { RemoverUsuarioUseCase } from '../use-cases/remover-usuario.use-case';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private readonly criarUsuarioUseCase: CriarUsuarioUseCase,
    private readonly listarUsuariosUseCase: ListarUsuariosUseCase,
    private readonly buscarUsuarioPorIdUseCase: BuscarUsuarioPorIdUseCase,
    private readonly atualizarUsuarioUseCase: AtualizarUsuarioUseCase,
    private readonly removerUsuarioUseCase: RemoverUsuarioUseCase,
  ) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.criarUsuarioUseCase.execute(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.listarUsuariosUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buscarUsuarioPorIdUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.atualizarUsuarioUseCase.execute(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.removerUsuarioUseCase.execute(id);
  }
}

