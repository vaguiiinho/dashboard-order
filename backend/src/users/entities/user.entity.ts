import { User as PrismaUser, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements PrismaUser {
  id: number;
  email: string;
  
  @Exclude()
  password: string;
  
  name: string;
  role: Role;
  department: string | null;
  city: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
