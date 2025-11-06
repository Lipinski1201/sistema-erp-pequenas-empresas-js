import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Sistema ERP par Pequenas Empresas')
    .setDescription('API REST para gestão de clientes, produtos, vendas e controle financeiro')
    .setVersion('1.0')
    .addTag('Clientes', 'Operações relacionadas a clientes')
    .addTag('Produtos', 'Operações relacionadas a produtos')
    .addTag('Vendas', 'Operações relacionadas a vendas')
    .addTag('Autenticação', 'Autenticação e autorização')
    .addTag('Usuários', 'Gerenciamento de usuários')
    .addBearerAuth()
    .build();
    
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, {
      useGlobalPrefix:true,
    });

  const port = process.env.PORT || 3000; 
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();