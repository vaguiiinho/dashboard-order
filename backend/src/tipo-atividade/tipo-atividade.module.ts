import { Module } from '@nestjs/common';
import { TipoAtividadeController } from './tipo-atividade.controller';
import { TipoAtividadeService } from './tipo-atividade.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoAtividadeController],
  providers: [TipoAtividadeService],
  exports: [TipoAtividadeService],
})
export class TipoAtividadeModule {}
