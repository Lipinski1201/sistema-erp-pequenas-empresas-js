import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ClientesModule,
    UsersModule,
    ProductsModule,
    SalesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}