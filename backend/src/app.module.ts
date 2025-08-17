import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { CrmModule } from './modules/crm/crm.module';
import { IXCModule } from './modules/ixc/ixc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsuariosModule,
    CrmModule,
    IXCModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
