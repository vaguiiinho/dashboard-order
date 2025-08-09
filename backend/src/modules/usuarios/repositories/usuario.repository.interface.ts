import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto/create-usuario.dto';

export interface IUsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
  update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
  delete(id: number): Promise<void>;
}

