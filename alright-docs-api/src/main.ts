import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Swagger settings
  const config = new DocumentBuilder()
    .setTitle('Alright - Docs manager')
    .setDescription('A Nestjs and MongoDB API for a legal docs manager system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha'
    },
    customSiteTitle: 'Alright API | Docs'
  });

  // CORS
  const corsOptions: CorsOptions = {
    origin: true, // allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow sending cookies from the client
  };

  // Enable CORS for all routes
  app.enableCors(corsOptions);

  await app.listen(3000);
}
bootstrap();
