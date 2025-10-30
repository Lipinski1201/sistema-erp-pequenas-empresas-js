import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested, Min, ArrayMinSize } from 'class-validator';

export class CreateSaleItemDto {
    @IsString()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateSaleDto {
    @IsString()
    clientId: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemDto)
    items: CreateSaleItemDto[];

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
