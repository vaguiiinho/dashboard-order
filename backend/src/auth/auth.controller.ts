import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { LoginUseCase } from './usecases/login.usecase';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserEntity } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.loginUseCase.execute(loginDto);
    
    return {
      success: true,
      data: result,
      message: 'Login realizado com sucesso',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const userEntity = new UserEntity(req.user);
    
    return {
      success: true,
      data: userEntity,
      message: 'Perfil do usuário',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    // Como JWT é stateless, apenas retornamos sucesso
    // O frontend deve remover o token
    return {
      success: true,
      message: 'Logout realizado com sucesso',
    };
  }
}
