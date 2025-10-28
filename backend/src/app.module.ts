import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdemServicoModule } from './ordem-servico/ordem-servico.module';
import { SetorModule } from './setor/setor.module';
import { ColaboradorModule } from './colaborador/colaborador.module';
import { TipoAtividadeModule } from './tipo-atividade/tipo-atividade.module';
import { CidadeModule } from './cidade/cidade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    OrdemServicoModule,
    SetorModule,
    ColaboradorModule,
    TipoAtividadeModule,
    CidadeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
