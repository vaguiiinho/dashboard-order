import { Usuario } from '../entities/usuario.entity';
import { Grupo } from '../entities/grupo.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';

export interface IUsuarioRepository {
  // Métodos de usuário
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
  update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
  delete(id: number): Promise<void>;

  // Métodos de grupo
  findGrupoById(id: number): Promise<Grupo | null>;
  findGrupoByNome(nome: string): Promise<Grupo | null>;
  createGrupo(grupo: Grupo): Promise<Grupo>;
  updateGrupo(id: number, grupo: Partial<Grupo>): Promise<Grupo>;
  deleteGrupo(id: number): Promise<void>;
  listarGrupos(): Promise<Grupo[]>;
}

