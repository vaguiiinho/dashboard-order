import { Module } from '@nestjs/common';
import { CidadeController } from './cidade.controller';
import { CidadeService } from './cidade.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CidadeController],
  providers: [CidadeService],
  exports: [CidadeService],
})
export class CidadeModule {}
