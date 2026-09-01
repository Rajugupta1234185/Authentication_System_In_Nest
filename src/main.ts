import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dns from "node:dns";
import { GlobalExceptionFilter } from './filters/globalException.filter';
import { AppLogger } from './logger/logger.service';


dns.setServers(['8.8.8.8' , '8.8.4.4']);

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //behind the scene it create express application okayy
  app.enableCors();
  app.useLogger(app.get(AppLogger));
  // app.useGlobalFilters( new GlobalExceptionFilter() );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
