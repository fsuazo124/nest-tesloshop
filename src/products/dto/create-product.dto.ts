import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength, isString } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @IsString({each: true}) //Todos los elementos que vienen en el arreglo deben ser strings
    @IsArray()
    sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;
    
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];
}
