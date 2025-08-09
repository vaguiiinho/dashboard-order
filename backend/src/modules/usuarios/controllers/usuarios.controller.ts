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

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private readonly criarUsuarioUseCase: CriarUsuarioUseCase,
    private readonly listarUsuariosUseCase: ListarUsuariosUseCase,
    private readonly buscarUsuarioPorIdUseCase: BuscarUsuarioPorIdUseCase,
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

  // TODO: Implementar update e delete use cases
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    // Implementar use case para atualizar usuário
    return `This action updates a #${id} usuario`;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    // Implementar use case para remover usuário
    return `This action removes a #${id} usuario`;
  }
}

