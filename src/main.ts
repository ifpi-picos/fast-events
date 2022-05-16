import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
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
  await app.listen(3000);
}
bootstrap();
