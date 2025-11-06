import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do cliente' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '12345678901', description: 'CPF ou CNPJ' })
  @IsString()
  @MinLength(11) // cpf/cnpj como string
  document: string;

  @ApiPropertyOptional({ example: 'joao@example.com', description: 'E-mail do cliente'})
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '47999999999', description: 'Telefone do cliente'})
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua Principal, 123', description: 'Endereço completo' })
  @IsOptional()
  @IsString()
  address?: string;
}
