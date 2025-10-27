import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdemServicoModule } from './ordem-servico/ordem-servico.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    OrdemServicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
