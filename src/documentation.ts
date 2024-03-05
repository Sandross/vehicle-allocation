import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const apiDocumentation = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('Vehicles Allocation Api')
    .setDescription('Api with standard CRUD operations for vehicles allocation')
    .setVersion('1.0')
    .addTag('vehicles')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
