import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

interface SaleItemData {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSaleDto) {
    // Verificar se cliente existe
    const client = await this.prisma.client.findUnique({
      where: { id: data.clientId },
    });
    if (!client) throw new NotFoundException('Client not found');

    // Calcular total e validar produtos
    let total = 0;
    const itemsData: SaleItemData[] = [];

    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (!product.active) {
        throw new BadRequestException(`Product ${product.name} is not active`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
    }

    // Criar venda com itens
    const sale = await this.prisma.sale.create({
      data: {
        clientId: data.clientId,
        total,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        items: {
          create: itemsData,
        },
      },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Atualizar estoque dos produtos
    for (const item of data.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return sale;
  }

  findAll() {
    return this.prisma.sale.findMany({
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async update(id: string, data: UpdateSaleDto) {
    await this.findOne(id);
    
    return this.prisma.sale.update({
      where: { id },
      data: {
        status: data.status,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const sale = await this.findOne(id);

    // Devolver estoque antes de cancelar
    for (const item of sale.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    return this.prisma.sale.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}