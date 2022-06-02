//import { ValidationPipe } from 'class-transformer';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { PrismaMongoService } from './prisma2.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle('Fast Events')
    .setDescription('The Fast Events documentation API')
    .setVersion('1.0')
    // .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  //primsa
  const dbService: PrismaService = app.get(PrismaService);
  dbService.enableShutdownHooks(app);

  const dbMongoService: PrismaMongoService = app.get(PrismaMongoService);
  dbMongoService.enableShutdownHooks(app);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}
bootstrap();
