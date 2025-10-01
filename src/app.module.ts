import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}

