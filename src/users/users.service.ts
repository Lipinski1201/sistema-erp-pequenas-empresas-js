import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
  // Verificar se email já existe
  const existingUser = await this.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ConflictException('Email already registered');
  }

  // Hash da senha
  const hashedPassword = data.password 
    ? await bcrypt.hash(data.password, 10)
    : await bcrypt.hash('senha123', 10);

  // Criar usuário com campos explícitos
  return this.prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role || 'user',
      active: data.active !== undefined ? data.active : true,
    },
  });
}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        // NÃO retorna password
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        // NÃO retorna password
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    const updateData: any = {
      email: data.email,
      name: data.name,
      role: data.role,
      active: data.active,
    };

    // Se forneceu nova senha, fazer hash
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { active: false }, // Soft delete
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    });
  }
}