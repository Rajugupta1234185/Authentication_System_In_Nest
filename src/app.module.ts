import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from './logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/globalException.filter';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { CourseModule } from './course/course.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true
    }),
    AppLoggerModule,
    MongooseModule.forRoot(process.env.MongoDbConnectionString ?? ''),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    AuthModule, UserModule, CourseModule, ],
  controllers: [AppController],
  providers: [AppService
    ,{
      provide:APP_FILTER,
      useClass : GlobalExceptionFilter
    },
    {
      provide : APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule {}
