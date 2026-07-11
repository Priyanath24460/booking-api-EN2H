import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsBoolean,
    Min,
} from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(1)
    duration: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsBoolean()
    isActive: boolean;
}