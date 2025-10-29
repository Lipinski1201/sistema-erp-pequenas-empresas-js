import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(11) // cpf/cnpj como string
  document: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
