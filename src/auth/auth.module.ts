import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from  "@nestjs/jwt";
import { jwtConstants } from './constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports : [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JwtSecret,
      signOptions : { expiresIn : '60s'}
    }),
    UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
