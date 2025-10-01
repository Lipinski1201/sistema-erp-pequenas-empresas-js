import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateClienteDto {
    @IsString() nome: string;
    @IsEmail() email: string;
    @IsOptional() @IsString() telefone?: string;
}
